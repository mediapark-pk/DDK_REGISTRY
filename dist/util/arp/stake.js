"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculator_1 = require("./calculator");
exports.initStakeARPCalculator = (config) => new calculator_1.ARPCalculator(config.ARP.DIRECT_REWARD.PERCENT_PER_LEVEL, config.ARP.DIRECT_REWARD.MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE);
