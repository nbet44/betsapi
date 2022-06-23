const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bet356PrematchModel = () => {
    var modelSchema = new Schema({
        bet365_id: { type: String, required: true },
        OurId: { type: String, required: true },
        SportId: { type: Number },
        HomeTeam: { type: String },
        AwayTeam: { type: String },
        IsPreMatch: { type: Boolean },
        stats: { type: Object },
        odds: { type: Object },
    });
    return mongoose.model("tbl_bet365_preEvent", modelSchema)
}

const bet356InplayModel = () => {
    var modelSchema = new Schema({
        bet365_id: { type: String, required: true },
        OurId: { type: String, required: true },
        SportId: { type: Number },
        HomeTeam: { type: String },
        AwayTeam: { type: String },
        IsPreMatch: { type: Boolean },
        stats: { type: Object },
        odds: { type: Object },
    });
    return mongoose.model("tbl_bet365_inplayEvent", modelSchema)
}

module.exports = {
    bet356PrematchModel: bet356PrematchModel(),
    bet356InplayModel: bet356InplayModel()
};