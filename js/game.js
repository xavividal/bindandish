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
                setMessage('b', 'Cannot shoot 😤');
                return;
            }
            shoot('b');
            if (hasRecharges('a')) {
                losesRecharges('a');
                return;
            }
            if (canLoseLife('a')) {
                lifeLost('a');
                if (!enoughLifesToKeepPlaying('a')) {
                    alert('You lost the game');
                    initGame();
                    return;
                }            
            }
        }
    }

    if (actionPlayerA == 'block') {
        if (actionPlayerB == 'recharge') {
            recharge('b');            
        }
        if (actionPlayerB == 'shoot') {
            if (canShoot('b')) {
                shoot('b');                
            }
            setMessage('a', 'Blocked 😎');
        }
    }

    if (actionPlayerA == 'shoot') {
        if (actionPlayerB == 'recharge') {
            if (!canShoot('a')) {
                recharge('b');
                setMessage('a', 'Cannot shoot 😤');
                return;
            }
            shoot('a');
            if (hasRecharges('b')) {
                losesRecharges('b');
                return;
            }               
            if (canLoseLife('b')) {
                lifeLost('b');
                if (!enoughLifesToKeepPlaying('b')) {
                    alert('I lost the game');
                    initGame();
                    return;
                }                
            }
        }
        if (actionPlayerB == 'block') {
            if (canShoot('a')) {
                shoot('a');
            }
            setMessage('b', 'Blocked 😎');
        }
        if (actionPlayerB == 'shoot') {
            if (hasRecharges('a')) {
                losesRecharges('a');
            }
            if (hasRecharges('b')) {
                losesRecharges('b');
            }            
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

function enoughLifesToKeepPlaying(player) {
    return getLifes(player) > 0;
}

function canLoseLife(player) {
    return getLifes(player) > 0;
}

function lifeLost(player) {
    setLifes(player, getLifes(player) - 1);
    setMessage(player, 'Life lost ☠️');
}

function hasRecharges(player) {
    return getRecharges(player) > 0;
}

function recharge(player) {
    setRecharges(player, getRecharges(player) + 1);
    setMessage(player, 'Recharged 😛');
}

function losesRecharges(player) {
    setRecharges(player, 0);
    setMessage(player, 'Recharges lost 😔');
}

function shoot(player) {
    setRecharges(player, getRecharges(player) - 2);
    setMessage(player, 'Shoot 🤠');
}

function canShoot(player) {
    return getRecharges(player) >= 2;
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

