const { default: axios } = require("axios");
const moment = require('moment');
const { sbobetPrematchModel } = require("../models/sbobetModel");
const { bet356PrematchModel, bet356InplayModel } = require("../models/bet365Model");
const { lxbetPrematchModel } = require("../models/lxbetModel");
const baseController = require("./baseController");
const { token, SportsList } = require("../config/index");

module.exports = async () => {
    //BET365 start
    const eventBet365 = async (param, IsPreMatch) => {
        const request = {
            method: "get",
            url: `https://api.b365api.com/v2/event/odds?token=${token}&event_id=${param.id}`
        };
        try {
            const response = await axios(request);
            if (response.data.success == 1) {
                let data = response.data.results
                let sdata = {
                    bet365_id: param.bet365_id,
                    OurId: param.id,
                    SportId: param.sport_id,
                    HomeTeam: param.home.name,
                    AwayTeam: param.away.name,
                    stats: data.stats,
                    odds: data.odds,
                    IsPreMatch
                }

                if (IsPreMatch) {
                    console.log('save prematch')
                    await baseController.BfindOneAndUpdate(bet356PrematchModel, { OurId: param.id }, sdata)
                } else {
                    console.log('save inplay')
                    await baseController.BfindOneAndUpdate(bet356InplayModel, { OurId: param.id }, sdata)
                }
            }
        } catch (e) {
            console.log('Getting BET365 pre-event odds', e.message)
        }
    }

    const prematchBet365 = async (sportId, page, day) => {
        const request = {
            method: "get",
            url: `https://api.b365api.com/v3/events/upcoming?sport_id=${sportId}&page=${page}&token=${token}&day=${day}`,
        };
        try {
            const response = await axios(request);
            if (response.data.success === 1) {
                let funcs = []
                for (let i in response.data.results) {
                    funcs.push(eventBet365(response.data.results[i], true))
                }
                Promise.all(funcs)
            }
        } catch (e) {
            console.log('Getting BET365 pre-event', e.message)
        }
    }

    const getPreBET365 = async () => {
        try {
            for (let i = 0; i < SportsList.length; i++) {
                for (let j = 0; j <= 4; j++) {
                    const request = {
                        method: "get",
                        url: `https://api.b365api.com/v3/events/upcoming?sport_id=${SportsList[i]}&token=${token}&day=${moment().add(j, 'days').format('yyMMDD')}`,
                    };
                    const response = await axios(request);
                    if (response.data.success === 1) {
                        let data = response.data
                        let total = Math.ceil(data.pager.total / data.pager.per_page)
                        for (let k = 1; k <= total; k++) {
                            await prematchBet365(SportsList[i], k, moment().add(j, 'days').format('yyMMDD'))
                        }
                    }
                }
            }
        } catch (e) {
            console.log('Start getting prematch BET365', e.message)
        }
    }

    const getInplayBET365 = async () => {
        try {
            for (let i = 0; i < SportsList.length; i++) {
                const request = {
                    method: "get",
                    url: `https://api.b365api.com/v3/events/inplay?sport_id=${SportsList[i]}&token=${token}`
                };
                const response = await axios(request);
                if (response.data.success === 1) {
                    let data = response.data.results
                    for (let j = 0; j < data.length; j++) {
                        await eventBet365(data[j], false)
                    }
                }
            }
        } catch (e) {
            console.log('Start getting prematch BET365', e.message)
        }
    }
    //BET365 end

    //SBOBET start
    const prematchOddSbobet = async (param) => {
        const request = {
            method: "get",
            url: "https://api.b365api.com/v1/sbobet/event?token=" + token + "&event_id=" + param.id,
        };
        try {
            const response = await axios(request);
            if (response.data.success == 1 && response.data.results.length) {
                let data = response.data.results[0]
                let sdata = {
                    Id: data.id,
                    OurId: param.our_event_id,
                    SportId: 1,
                    SportName: "Soccer",
                    HomeTeam: param.home.name,
                    AwayTeam: param.away.name,
                    IsPreMatch: true,
                    markets: data.markets,
                    updated_at: data.updated_at
                }
                await baseController.BfindOneAndUpdate(sbobetPrematchModel, { Id: sdata.Id }, sdata)
            }
        } catch (e) {
            console.log('Getting SBOBET pre-event odds', e.message)
        }
    }

    const prematchSbobet = async (page = 1) => {
        const request = {
            method: "get",
            url: "https://api.b365api.com/v1/sbobet/upcoming?sport_id=1&page=" + page + "&token=" + token,
        };
        try {
            const response = await axios(request);
            if (response.data.success === 1) {
                let funcs = []
                for (let i in response.data.results) {
                    funcs.push(prematchOddSbobet(response.data.results[i]))
                }
                Promise.all(funcs)
            }
        } catch (e) {
            console.log('Getting SBOBET pre-event', e.message)
        }
    }

    const getPreSbobet = async () => {
        const request = {
            method: "get",
            url: "https://api.b365api.com/v1/sbobet/upcoming?sport_id=1&token=" + token,
        };
        try {
            const response = await axios(request);
            if (response.data.success === 1) {
                let data = response.data
                let total = Math.ceil(data.pager.total / data.pager.per_page)
                for (let i = 1; i <= total; i++) {
                    await prematchSbobet([i])
                }
            }
        } catch (e) {
            console.log('Start getting prematch SBOBET', e.message)
        }
    }
    //SBOBET end

    //1XBET start
    const prematchOdd1XBET = async (param, isPrematch = true) => {
        try {
            const request = {
                method: "get",
                url: "https://api.b365api.com/v1/1xbet/event?token=" + token + "&event_id=" + param.id,
            };
            const response = await axios(request);
            if (response.data.success == 1 && response.data.results.length) {
                let data = response.data.results[0]
                let sdata = {
                    Id: data.id,
                    OurId: param.our_event_id,
                    SportId: 1,
                    HomeTeam: param.home.name,
                    AwayTeam: param.away.name,
                    IsPreMatch: true,
                    Value: data.Value,
                    updated_at: data.updated_at
                }
                await baseController.BfindOneAndUpdate(lxbetPrematchModel, { Id: sdata.Id }, sdata)
            }

        } catch (e) {
            console.log('Getting 1XBET pre-event odds', e.message)
        }
    }

    const prematch1XBET = async (page = 1) => {
        const request = {
            method: "get",
            url: "https://api.b365api.com/v1/1xbet/upcoming?sport_id=1&page=" + page + "&token=" + token,
        };
        try {
            const response = await axios(request);
            if (response.data.success === 1) {
                let funcs = []
                for (let i in response.data.results) {
                    funcs.push(prematchOdd1XBET(response.data.results[i]))
                }
                Promise.all(funcs)
            }
        } catch (e) {
            console.log('Getting 1XBET pre-event', e.message)
        }
    }

    const getPre1XBET = async () => {
        const request = {
            method: "get",
            url: "https://api.b365api.com/v1/1xbet/upcoming?sport_id=1&token=" + token,
        };
        try {
            const response = await axios(request);
            if (response.data.success === 1) {
                let data = response.data
                let total = Math.ceil(data.pager.total / data.pager.per_page)
                for (let i = 1; i <= total; i++) {
                    await prematch1XBET([i])
                }
            }
        } catch (e) {
            console.log('Start getting prematch 1XBET', e.message)
        }
    }
    //1XBET end

    setInterval(async function () {
        await getPreBET365()
        await getInplayBET365()
        console.log("refesh")
    }, 1000 * 60, 1)
};