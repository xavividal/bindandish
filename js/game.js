$(function() {
    initGame();
    declareActions();
});

let availableActions = ['recharge', 'shoot', 'block'];

function initGame() {
    $('#player_a_lifes').val(3);
    $('#player_b_lifes').val(3);
    $('#player_a_recharges').val(0);
    $('#player_b_recharges').val(0);
    $('#player_a_action').val('');
    $('#player_b_action').val('');
    $('#player_a_message').val('');
    $('#player_b_message').val('');
}

function declareActions() {
    $('#action_recharge').on('click', actionRecharge);
    $('#action_block').on('click', actionBlock);
    $('#action_shoot').on('click', actionShoot);
}

function actionRecharge() {
    action('recharge');
}

function actionBlock() {
    action('block');
}

function actionShoot() {
    action('shoot');
}

function action(action) {
    let actionPlayerA = action;
    let actionPlayerB = availableActions[getRandomInt(3)];

    if (actionPlayerB == 'shoot' && !canShoot('b')) {
        actionPlayerB = getRandomInt(2) == 0 ? 'block' : 'recharge';
    }

    if (actionPlayerB == 'block' && !canShoot('a')) {
        actionPlayerB = getRandomInt(2) == 0 ? 'shoot' : 'recharge';

        if (actionPlayerB == 'shoot' && !canShoot('b')) {
            actionPlayerB = 'recharge';
        }
    }

    $('#player_a_action').val(actionPlayerA);
    $('#player_b_action').val(actionPlayerB);

    clearMessage('a');
    clearMessage('b');

    if (actionPlayerA == 'recharge') {
        if (actionPlayerB == 'recharge') {
            recharge('a');
            recharge('b');
        }
        if (actionPlayerB == 'block') {
            recharge('a');
        }
        if (actionPlayerB == 'shoot') {
            if (!canShoot('b')) {
                recharge('a');
                return;
            }
            if (hasDragonBall('b')) {
                shootDragonBall('b');
                losesRecharges('a');  
                lifeLost('a');                 
                return;                          
            }

            shoot('b');
            losesRecharges('a');
        }
    }

    if (actionPlayerA == 'block') {
        if (actionPlayerB == 'recharge') {
            recharge('b');            
        }
        if (actionPlayerB == 'shoot') {
            setMessage('a', 'Blocked 😎');
            if (hasDragonBall('b')) {
                shootDragonBall('b');
                return;
            }
            if (canShoot('b')) {
                shoot('b');                
            }
        }
    }

    if (actionPlayerA == 'shoot') {
        if (actionPlayerB == 'recharge') {
            if (!canShoot('a')) {
                recharge('b');
                return;
            }
            if (hasDragonBall('a')) {
                shootDragonBall('a');
                losesRecharges('b');  
                lifeLost('b');                 
                return;                          
            }

            shoot('a');
            losesRecharges('b');
        }
        if (actionPlayerB == 'block') {
            setMessage('b', 'Blocked 😎');
            if (hasDragonBall('a')) {
                shootDragonBall('a');
                return;
            }
            if (canShoot('a')) {
                shoot('a');
            }
        }
        if (actionPlayerB == 'shoot') {
            losesRecharges('a');
            losesRecharges('b');
        }
    }
}

function clearMessage(player) {
    setMessage(player, '');
}

function setMessage(player, message) {
    $('#player_'+player+'_message').val(message);
}

function hasDragonBall(player) {
    return getRecharges(player) > 4;
}

function shootDragonBall(player) {
    losesRecharges(player);
    setMessage(player, 'Dragon Ball ☄️');
}

function enoughLifesToKeepPlaying(player) {
    return getLifes(player) > 0;
}

function canLoseLife(player) {
    return getLifes(player) > 0;
}

function lifeLost(player) {
    setLifes(player, getLifes(player) - 1);
    setMessage(player, 'Life lost ☠️');
    if (!enoughLifesToKeepPlaying(player)) {
        alert('Player ' + player + ' lost the battle');
        initGame();
    }    
}

function hasRecharges(player) {
    return getRecharges(player) > 0;
}

function recharge(player) {
    setRecharges(player, getRecharges(player) + 1);
    setMessage(player, 'Recharged 😛');
}

function spendRecharges(player) {
    setRecharges(player, getRecharges(player) - 2);
    setMessage(player, 'Recharges spent');
}

function losesRecharges(player) {
    if (hasRecharges(player)) {
        setRecharges(player, 0);
        setMessage(player, 'Recharges lost 😔');
        return;
    }
}

function shoot(player) {
    spendRecharges(player);
    setMessage(player, 'Shoot 🤠');
}

function canShoot(player) {    
    let result = getRecharges(player) >= 2;
    if (result == false) {
        setMessage(player, 'Cannot shoot 😤');
    }
    return result;
}

function getLifes(player) {
    return getValue(player, 'lifes');
}

function setLifes(player, lifes) {
    setValue(player, 'lifes', lifes);
}

function getRecharges(player) {
    return getValue(player, 'recharges');
}

function setRecharges(player, recharges) {
    setValue(player, 'recharges', recharges);
}

function getValue(player, key) {
    return parseInt($('#player_'+player+'_'+key).val());
}

function setValue(player, key, value) {
    $('#player_'+player+'_'+key).val(value);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

