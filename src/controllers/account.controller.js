const Web3 = require('web3');
const axios = require("axios");
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/662e7dda4ec44bdb835450446b67b443")) //TODO: Make the link config

const link = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2C&vs_currencies=usd"

exports.balance = async function (req, res) {

    const {addressList} = req.body

    try {
        const ethereumGet = await axios.get(link)
        const usdValue = (quantity) => ethereumGet.data?.ethereum?.usd * parseFloat(quantity)

        const getValue = async (address) => {
            if (!Web3.utils.isAddress(address)) {
                return "Not Valid"
            }
            let balance = await web3.eth.getBalance(address)
            return web3.utils.fromWei(balance, "ether")
        }

        const mapArray = addressList.map(async (address) => {
            let obj = {}
            let ether = await getValue(address)
            let usd = usdValue(ether)
            obj[address] = {
                "ether": ether,
                "usd" : usd
            }
            if (usd) return obj
        })
        let promises = await Promise.all(mapArray)
        let filtered = promises.filter(f => f !== undefined)

        return res.status(200).send(filtered)
    } catch (e) {
        return res.status(404).send({
            err: "Not found"
        })
    }
}
