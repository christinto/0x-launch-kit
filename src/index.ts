#!/usr/bin/env node

import * as fs from 'fs';
//import * as inquirer from 'inquirer';

import { buildDockerComposeYml, BuildOptions, Network } from './build';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const mockERC721Address = '0x07f96aa816c1f244cbc6ef114bb2b023ba54a2eb';

// Hardcoded values for token type and network
const tokenType: "ERC20" | "ERC721" = "ERC20"; // Set token type to ERC20
const network: Network = "kovan"; // Hardcoded network to Kovan

function getRpcUrl(network: Network): string {
    switch (network) {
        case 'mainnet':
            return 'https://mainnet.infura.io/';
        case 'kovan':
            return 'https://kovan.infura.io/';
        case 'ropsten':
            return 'https://ropsten.infura.io/';
        case 'rinkeby':
            return 'https://rinkeby.infura.io/';
        case 'ganache':
            return 'http://ganache:8545/';
        case 'custom':
            return 'http://localhost:8545/';
    }
}

//const isAddress = (s: string) => /(0x)?[0-9a-fA-F]{40}/.test(s);

async function main() {
    // Remove networkChoices as it's no longer used
    // const networkChoices: Array<{ name: string; value: Network }> = [...];  // Removed

    const answers = {
        tokenType: tokenType, // Hardcoded value for token type
        network: network, // Hardcoded value for network (Kovan)
        rpcUrl: getRpcUrl(network), // Automatically set based on the network
        relayerUrl: 'http://localhost:3000/sra/v3', // Hardcoded Relayer URL
        relayerWebsocketUrl: 'ws://localhost:3000/sra/v3', // Hardcoded WebSocket URL
        feeRecipient: ZERO_ADDRESS, // Hardcoded fee recipient
        theme: 'light' as 'light' | 'dark', // Hardcoded theme as 'light'
        port: 3001, // Hardcoded port
        makerFee: 0, // Hardcoded maker fee
        takerFee: 0, // Hardcoded taker fee
        collectibleAddress: ZERO_ADDRESS, // Hardcoded ERC721 collectible address
        collectibleName: '', // Hardcoded ERC721 name if applicable
        collectibleDescription: '', // Hardcoded ERC721 description if applicable
    };

    console.log(
        `
    Wizard complete.

    🚀🚀🚀🚀 .... Preparing for liftoff .... 🚀🚀🚀🚀

    Run << docker-compose up >> and open your browser to http://localhost:` +
            answers.port +
            `\n\n\n\n\n`,
    );

    const rpcUrl = answers.network === 'ganache' ? 'http://ganache:8545' : answers.rpcUrl;

    const options: BuildOptions = {
        tokenType: answers.tokenType,
        network: answers.network,
        rpcUrl,
        relayerUrl: answers.relayerUrl,
        relayerWebsocketUrl: answers.relayerWebsocketUrl,
        feeRecipient: answers.feeRecipient || ZERO_ADDRESS,
        theme: answers.theme,
        port: answers.port,
        makerFee: answers.makerFee || 0,
        takerFee: answers.takerFee || 0,
        collectibleAddress: answers.collectibleAddress || mockERC721Address,
        collectibleName: answers.collectibleName || '',
        collectibleDescription: answers.collectibleDescription || '',
    };

    const dockerComposeYml = buildDockerComposeYml(options);

    const composeFilePath = process.argv[2] || 'docker-compose.yml';

    fs.writeFileSync(composeFilePath, dockerComposeYml);
}

main();
