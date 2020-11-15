export default class PayoffTable {
    constructor() {
        this.payoffTable;
    }

    getPayoffTable = function(){
        return this.payoffTable;
    }
    
    setPayoffTable = function(tradeStructure) {

        //create columns and rows to array
        let arr = this.create_cols_rows(tradeStructure);
        
        //loop through all remaining cells and fill in correct payoff
        for (let i = 1; i < arr.length; i++) {
            for (let j = 1; j < arr[0].length; j++) {
                arr[i][j] = this.getPayoff(tradeStructure.Options[i], arr[0][j]);
            }
        }
        //add underlying shares
        if (tradeStructure.St != 0) {
            arr = this.addUnderlying(tradeStructure, arr);
        }

        //add total row
        arr.push([]);
        let column = []
        for (let i = 0; i < arr[0].length; i++) {
            if (i == 0) {
                arr[arr.length - 1][i] = 'Total Payoff';
                continue;
            }
            //Build column
            for (let j = 1; j < arr.length - 1; j++) {
                column.push(arr[j][i])
            }
            arr[arr.length - 1][i] = this.generateTotal(column);
            column = [];
        }
        this.payoffTable = arr;
    }
    create_cols_rows = function(tradeStructure) {
        let cols_rows = [];
        let strikes = this.getStrikes(tradeStructure);
        strikes.unshift(null);

        // Create inital array with correct columns and rows
        for (let i = 0; i < tradeStructure.Options.length; i++) {
            cols_rows[i] = [];
            for (let j = 0; j < strikes.length; j++) {
                if (i == 0 && j == 0) {
                    continue;
                } else if (i == 0) {
                    if (j == 1) {
                        cols_rows[i][j] = `St < ${strikes[j]}`;
                    } else if (j <= strikes.length - 1) {
                        cols_rows[i][j] = `${strikes[j-1]} < St < ${strikes[j]}`;
                    } 
                    if (j == strikes.length - 1) {
                        cols_rows[i][j + 1] = `St > ${strikes[j]}`;
                    }
                } else if (j == 0) {
                    cols_rows[i][j] = `${tradeStructure.Options[i].bs} ${tradeStructure.Options[i].cp} ${tradeStructure.Options[i].k}`;
                }
            }
        }
        return cols_rows;
    }

    //Input: the option object and strike inequality
    //Output: A string representing the payoff
    getPayoff = function(option, strike_ieq) {
        if (strike_ieq.split('<').length - 1 == 1) {
            return this.payoffStrikeGreatX(option);
        } else if (strike_ieq.split('<').length - 1 == 2) {
            //Extract min strike
            let min = strike_ieq.split(['<'])[0].trim() * 1;
            if (option.k <= min) {
                return this.payoffStrikeLessX(option);
            } else {
                return this.payoffStrikeGreatX(option);
            }
        } else {
            return this.payoffStrikeLessX(option);
        }
    }

    payoffStrikeGreatX = function(option) {
        // 4 cases, we know all options will have strikes greater than St bc strikes are sorted
        if (option.bs == 'BUY' && option.cp == 'CALL') {
            return '0';
        } else if (option.bs == 'SELL' && option.cp == 'CALL') {
            return '0';
        } else if (option.bs == 'BUY' && option.cp == 'PUT') {
            return `-St + ${option.k}`;
        } else {
            return `St - ${option.k}`;
        }
    }

    payoffStrikeLessX = function(option) {
        // 4 cases, we know all options will have strikes less than St bc strikes are sorted
        if (option.bs == 'BUY' && option.cp == 'CALL') {
            return `St - ${option.k}`;
        } else if (option.bs == 'SELL' && option.cp == 'CALL') {
            return `-St + ${option.k}`;
        } else if (option.bs == 'BUY' && option.cp == 'PUT') {
            return `0`;
        } else {
            return '0';
        }
    }

    addUnderlying = function(tradeStructure, arr) {
        arr[arr.length] = [];
        for (let j = 0; j < arr[0].length; j++) {
            if (j == 0) {
                arr[arr.length - 1][j] = 'Underlying Shares'
            } else {
                if (tradeStructure.St == 1) {
                    arr[arr.length - 1][j] = 'St'
                } else if (tradeStructure.St == -1) {
                    arr[arr.length - 1][j] = '-St'
                } else {
                    arr[arr.length - 1][j] = `${tradeStructure.St}(St)`;
                }
            }
        }
        return arr;
    }
    
    getStrikes = function(tradeStructure) {
        let strikes = [];
        
        tradeStructure.Options.forEach((option, index) => {
            if (index == 0) {
                return;
            }
            if (!strikes.includes(option.k)) {
                strikes.push(option.k);
            } 
        });
        strikes.sort();
        return strikes;
    }

    generateTotal = function(array) {
        let St = 0;
        let num = 0;
        array.forEach(function(payoff) {
            if (payoff == '0') {
                return;
            }
            if (payoff.includes(' + ')) {
                let charArr = payoff.split(' + ');
                num += charArr[charArr.length - 1] * 1;
                if (charArr[0].includes('-')) {
                    St -= 1;
                } else {
                    St += 1
                }
            } else if (payoff.includes(' - ')) {
                let charArr = payoff.split(' - ');
                num -= charArr[charArr.length - 1] * 1;
                if (charArr[0].includes('-')) {
                    St -= 1;
                } else {
                    St += 1;
                }
            } else {
                if (payoff.includes('(')) {
                    let charArr = payoff.split('(');
                    St += charArr[0] * 1;
                } else {
                    if (payoff.includes('-')) {
                        St -= 1;
                    } else {
                        St += 1;
                    }
                }
            }
        });
        
        if (St == 0) {
            return `${num}`;
        } else if (num == 0) {
            if (St == 1) {
                return 'St';
            } else if (St == -1) {
                return '-St';
            } else {
                return `${St}(St)`;
            }
        } else if (num < 0) {
            if (St == 1) {
                return `St - ${num * -1}`;
            } else if (St == -1) {
                return `-St - ${num * -1}`;
            } else {
                return `${St}(St) - ${num * -1}`;
            }
        } else {
            if (St == 1) {
                return `St + ${num}`;
            } else if (St == -1) {
                return `-St + ${num}`;
            } else {
                return `${St}(St) + ${num}`;
            }
        }
    }
}
