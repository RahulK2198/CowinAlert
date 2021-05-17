import { Sessions } from "./sessions";

export class Centers {
    constructor(
        public center_id: Number,
        public name: String,
        public address: String,
        public state_name: String,
        public district_name: String,
        public pincode: Number,
        public sessions: Sessions[]) {}

}
