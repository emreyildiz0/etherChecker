const Web3 = require('web3');
const axios = require('axios');

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const ETHEREUM_NETWORK_URL = 'https://mainnet.infura.io/v3/662e7dda4ec44bdb835450446b67b443';

//Move to another place for god sake
class EthereumInfo {
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_NETWORK_URL));
    }

    async getEtherPriceInUsd() {
        try {
            const response = await axios.get(`${COIN_GECKO_API_URL}?ids=ethereum&vs_currencies=usd`);
            return response.data.ethereum.usd;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to get Ethereum price in USD');
        }
    }

    async getEtherBalance(address) {
        if (!Web3.utils.isAddress(address)) {
            throw new Error('Invalid Ethereum address');
        }

        try {
            const balanceInWei = await this.web3.eth.getBalance(address);
            return this.web3.utils.fromWei(balanceInWei, 'ether');
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Ether balance for address ${address}`);
        }
    }

    async getAddressBalances(addressList) {
        const etherPriceInUsd = await this.getEtherPriceInUsd();

        const addressBalances = await Promise.all(
            addressList.map(async address => {
                const etherBalance = await this.getEtherBalance(address);
                const usdBalance = etherPriceInUsd * parseFloat(etherBalance);
                return { [address]: { ether: etherBalance, usd: usdBalance } };
            }),
        );

        return addressBalances.filter(balance => balance !== undefined);
    }
}

async function balance(req, res) {
    const { addressList } = req.body;
    const ethereumInfo = new EthereumInfo();

    try {
        const balances = await ethereumInfo.getAddressBalances(addressList);
        res.status(200).send(balances);
    } catch (error) {
        console.error(error);
        res.status(404).send({ err: 'Not found' });
    }
}

module.exports = { balance };
