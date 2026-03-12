// PrivyShare file registry: ownership, listing, access on Aleo.
// Program ID must be unique; use privyshare_files_7879.aleo.

program privyshare_files_7879.aleo {
    // Counter for unique file IDs (singleton key 0u8)
    mapping file_counter: u8 => u64;
    // file_id => (owner, ipfs_cid as field, price in microcredits)
    mapping files: u64 => file_info;
    // Revoked access: (file_id, buyer_address) => true if revoked
    mapping revoked_access: access_key => boolean;

    struct file_info {
        owner: address,
        ipfs_cid: field,
        price: u64,
    }

    struct access_key {
        file_id: u64,
        user: address,
    }

    record file_record {
        owner: address,
        file_id: u64,
        ipfs_cid: field,
        price: u64,
    }

    record access_record {
        owner: address,
        file_id: u64,
    }

    @noupgrade
    async constructor() {}

    // Register a new file. Caller must pass next file_id (query file_counter first); async block verifies and stores.
    async transition register_file(
        public ipfs_cid: field,
        public price: u64,
        public file_id: u64,
    ) -> (file_record, Future) {
        let rec = file_record {
            owner: self.caller,
            file_id,
            ipfs_cid,
            price,
        };
        let id_future = async {
            let current = Mapping::get_or_use(file_counter, 0u8, 0u64);
            assert_eq(file_id, current + 1u64);
            Mapping::set(file_counter, 0u8, file_id);
            Mapping::set(files, file_id, file_info {
                owner: self.caller,
                ipfs_cid,
                price,
            });
        };
        return (rec, id_future);
    }

    // Update price; caller must be owner (proven by consuming their file_record).
    async transition set_price(
        public file_id: u64,
        public new_price: u64,
        input file_record,
    ) -> (file_record, Future) {
        let fut = async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.owner, input.owner);
            assert_eq(input.owner, self.caller);
            assert_eq(input.file_id, file_id);
            Mapping::set(files, file_id, file_info {
                owner: info.owner,
                ipfs_cid: info.ipfs_cid,
                price: new_price,
            });
        };
        let rec = file_record {
            owner: input.owner,
            file_id,
            ipfs_cid: input.ipfs_cid,
            price: new_price,
        };
        return (rec, fut);
    }

    // Owner grants access to buyer (e.g. after payment). Creates AccessRecord for buyer.
    async transition grant_access(
        public file_id: u64,
        public buyer: address,
    ) -> (access_record, Future) {
        let fut = async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.owner, self.caller);
        };
        let rec = access_record { owner: buyer, file_id };
        return (rec, fut);
    }

    // Owner revokes access for a buyer.
    async transition revoke_access(
        public file_id: u64,
        public buyer: address,
    ) -> Future {
        return async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.owner, self.caller);
            let k = access_key { file_id, user: buyer };
            Mapping::set(revoked_access, k, true);
        };
    }

    // Revoked status is stored in mapping revoked_access; query it via program state / RPC.
}
