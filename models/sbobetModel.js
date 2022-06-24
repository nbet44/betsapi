const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sbobetPrematchModel = () => {
    var modelSchema = new Schema({
        Id: { type: String, required: true },
        OurId: { type: String, required: true },
        SportId: { type: Number },
        SportName: { type: String },
        HomeTeam: { type: String },
        AwayTeam: { type: String },
        IsPreMatch: { type: Boolean },
        markets: { type: Array },
        updated_at: { type: Number }
    });
    return mongoose.model("tbl_sbobet_preEvent", modelSchema)
}

const sbobetInplayModel = () => {
    var modelSchema = new Schema({
        Id: { type: String, required: true },
        OurId: { type: String, required: true },
        SportId: { type: Number },
        SportName: { type: String },
        HomeTeam: { type: String },
        AwayTeam: { type: String },
        IsPreMatch: { type: Boolean },
        markets: { type: Array },
        updated_at: { type: Number }
    });
    return mongoose.model("tbl_sbobet_inplayEvent", modelSchema)
}
module.exports = {
    sbobetPrematchModel: sbobetPrematchModel(),
    sbobetInplayModel: sbobetInplayModel(),
};