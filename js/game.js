$(function() {
    initGame();
    initButtons();
    initLabels();
    declareActions();
});

let language = 'ca';

let messages = {
    'en': {
        'RECHARGE': 'Recharge',
        'BLOCK': 'Block',
        'SHOOT': 'Shoot',
        'LABEL_LIFES': 'Lifes',
        'LABEL_RECHARGES': 'Recharges',
        'LABEL_ACTION': 'Action',
        'LABEL_MESSAGE': 'Message',
        'ACTION_RECHARGE': 'Recharge',
        'ACTION_BLOCK': 'Block',
        'ACTION_SHOOT': 'Shoot',
        'BLOCKED': 'Blocked 😎',
        'DRAGONBALL': 'Dragon Ball ☄️',  
        'LIFELOST': 'Life lost ☠️',
        'RECHARGED': 'Recharged 😛',
        'RECHARGES_SPENT': 'Recharges spent',
        'RECHARGES_LOST': 'Recharges lost 😔',
        'PLAYER_LOST_GAME': 'Game has been lost for player',
        'CANNOT_SHOOT': 'Cannot shoot 😤',
        'CAN_SHOOT': 'Shoot 🤠',
    },
    'ca': {
        'RECHARGE': 'Recarrega',
        'BLOCK': 'Bloqueja',
        'SHOOT': 'Dispara',        
        'LABEL_LIFES': 'Vides',
        'LABEL_RECHARGES': 'Recarregues',
        'LABEL_ACTION': 'Accio',
        'LABEL_MESSAGE': 'Missatge',        
        'ACTION_RECHARGE': 'Recarrega',
        'ACTION_BLOCK': 'Bloqueja',
        'ACTION_SHOOT': 'Dispara',        
        'BLOCKED': 'Bloquejat 😎',
        'DRAGONBALL': 'Bola de Drac ☄️',  
        'LIFELOST': 'Vida perduda ☠️',
        'RECHARGED': 'Recarregat 😛',
        'RECHARGES_SPENT': 'Recarregues gastades',
        'RECHARGES_LOST': 'Recarregues perdudes 😔',
        'PLAYER_LOST_GAME': 'La partida ha estat perduda pel jugador',
        'CANNOT_SHOOT': 'No pot disparar 😤',
        'CAN_SHOOT': 'Dispara 🤠',        
    },
};

let availableActions = ['recharge', 'shoot', 'block'];

function translate(key) {
    return messages[language][key];
}

function initButtons() {
    $('#action_recharge').html(translate('ACTION_RECHARGE'));
    $('#action_block').html(translate('ACTION_BLOCK'));
    $('#action_shoot').html(translate('ACTION_SHOOT'));
}

function initLabels() {
    $('#label_lifes').html(translate('LABEL_LIFES'));
    $('#label_recharges').html(translate('LABEL_RECHARGES'));
    $('#label_action').html(translate('LABEL_ACTION'));
    $('#label_message').html(translate('LABEL_MESSAGE'));
}

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

    $('#player_a_action').val(translate(actionPlayerA.toUpperCase()));
    $('#player_b_action').val(translate(actionPlayerB.toUpperCase()));

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
            setMessage('a', translate('BLOCKED'));
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
            setMessage('b', translate('BLOCKED'));
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
    setMessage(player, translate('DRAGONBALL'));
}

function enoughLifesToKeepPlaying(player) {
    return getLifes(player) > 0;
}

function canLoseLife(player) {
    return getLifes(player) > 0;
}

function lifeLost(player) {
    setLifes(player, getLifes(player) - 1);
    setMessage(player, translate('LIFELOST'));
    if (!enoughLifesToKeepPlaying(player)) {
        alert(translate('PLAYER_LOST_GAME')+' '+player);
        initGame();
    }    
}

function hasRecharges(player) {
    return getRecharges(player) > 0;
}

function recharge(player) {
    setRecharges(player, getRecharges(player) + 1);
    setMessage(player, translate('RECHARGED'));
}

function spendRecharges(player) {
    setRecharges(player, getRecharges(player) - 2);
    setMessage(player, translate('RECHARGES_SPENT'));
}

function losesRecharges(player) {
    if (hasRecharges(player)) {
        setRecharges(player, 0);
        setMessage(player, translate('RECHARGES_LOST'));
        return;
    }
}

function shoot(player) {
    spendRecharges(player);
    setMessage(player, translate('CAN_SHOOT'));
}

function canShoot(player) {    
    let result = getRecharges(player) >= 2;
    if (result == false) {
        setMessage(player, translate('CANNOT_SHOOT'));
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

