const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bet356PrematchModel = () => {
    var modelSchema = new Schema({
        FI: { type: String, required: true },
        EventId: { type: String, required: true },
        OurId: { type: String, required: true },
        SportId: { type: Number },
        SportName: { type: String },
        HomeTeam: { type: String },
        AwayTeam: { type: String },
        IsPreMatch: { type: Boolean },
        asian_lines: { type: Object },
        goals: { type: Object },
        half: { type: Object },
        main: { type: Object },
        schedule: { type: Object },
        updated_at: { type: Number }
    });
    return mongoose.model("tbl_bet365_preEvent", modelSchema)
}

const bet356InplayModel = () => {
    var modelSchema = new Schema({
        FI: { type: String, required: true },
        EventId: { type: String, required: true },
        OurId: { type: String, required: true },
        SportId: { type: Number },
        SportName: { type: String },
        HomeTeam: { type: String },
        AwayTeam: { type: String },
        IsPreMatch: { type: Boolean },
        asian_lines: { type: Object },
        goals: { type: Object },
        half: { type: Object },
        main: { type: Object },
        schedule: { type: Object },
        updated_at: { type: Number }
    });
    return mongoose.model("tbl_bet365_inplayEvent", modelSchema)
}

module.exports = {
    bet356PrematchModel: bet356PrematchModel(),
    bet356InplayModel: bet356InplayModel()
};