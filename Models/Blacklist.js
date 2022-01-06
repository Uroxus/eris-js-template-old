import mongoose from 'mongoose'

const BlacklistSchema = new mongoose.Schema( {
    _id: String,
    _expires: { type: Date, expires: 0 },
    _moderator: String,
    _notes: String
}, {
    collection: "blacklist"
} )

export default mongoose.model( "blacklist", BlacklistSchema )