// PrivyShare file registry: ownership, listing, access on Aleo.
// Program ID must be unique; use privyshare_files_7879.aleo.
//
// purchase_file: Buyer pays with credits.aleo/transfer_private; access granted atomically.
// grant_access: Manual fallback when buyer pays off-chain.
// verify_access: Query revoked_access mapping via RPC; key = { file_id: Nu64, user: address }.

import credits.aleo;

program privyshare_files_7879.aleo {
    // Counter for unique file IDs (singleton key 0u8)
    mapping file_counter: u8 => u64;
    // file_id => (owner, ipfs_cid as field, price in microcredits)
    mapping files: u64 => file_info;
    // Revoked access: (file_id, buyer_address) => true if revoked
    mapping revoked_access: access_key => bool;

    struct file_info {
        file_owner: address,
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
        let caller = self.caller;
        let rec = file_record {
            owner: caller,
            file_id,
            ipfs_cid,
            price,
        };
        let id_future = async {
            let current = Mapping::get_or_use(file_counter, 0u8, 0u64);
            assert_eq(file_id, current + 1u64);
            Mapping::set(file_counter, 0u8, file_id);
            Mapping::set(files, file_id, file_info {
                file_owner: caller,
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
        input: file_record,
    ) -> (file_record, Future) {
        let caller = self.caller;
        let fut = async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.file_owner, input.owner);
            assert_eq(input.owner, caller);
            assert_eq(input.file_id, file_id);
            Mapping::set(files, file_id, file_info {
                file_owner: info.file_owner,
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
    // Clears revoked_access so a previously revoked buyer can be re-granted.
    async transition grant_access(
        public file_id: u64,
        public buyer: address,
    ) -> (access_record, Future) {
        let caller = self.caller;
        let fut = async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.file_owner, caller);
            let k = access_key { file_id, user: buyer };
            Mapping::set(revoked_access, k, false);
        };
        let rec = access_record { owner: buyer, file_id };
        return (rec, fut);
    }

    // Owner revokes access for a buyer.
    async transition revoke_access(
        public file_id: u64,
        public buyer: address,
    ) -> Future {
        let caller = self.caller;
        return async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.file_owner, caller);
            let k = access_key { file_id, user: buyer };
            Mapping::set(revoked_access, k, true);
        };
    }

    // Purchase file with on-chain payment. Buyer pays seller via credits.aleo; access granted atomically.
    // Caller must pass seller and price from getFileInfo; async block verifies mapping matches.
    // Clears revoked_access so a previously revoked buyer can purchase again.
    // Input: payment = buyer's credits record (must have microcredits >= price).
    // Returns: buyer's change record, access_record for buyer.
    async transition purchase_file(
        public file_id: u64,
        public seller: address,
        public price: u64,
        input: credits.aleo/credits,
    ) -> (credits.aleo/credits, access_record, Future) {
        let caller = self.caller;
        assert_eq(input.owner, caller);
        assert(input.microcredits >= price);
        let (seller_rec, buyer_change) = credits.aleo/transfer_private(input, seller, price);
        let rec = access_record { owner: caller, file_id };
        let fut = async {
            let info = Mapping::get(files, file_id);
            assert_eq(info.file_owner, seller);
            assert_eq(info.price, price);
            let k = access_key { file_id, user: caller };
            Mapping::set(revoked_access, k, false);
        };
        return (buyer_change, rec, fut);
    }

    // verify_access: Query revoked_access mapping via RPC; key = { file_id: Nu64, user: address }.
    // true = revoked; false or 404 = not revoked.
}
