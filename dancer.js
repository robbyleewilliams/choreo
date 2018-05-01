//import {createSimpleStep} from 'simpleStep';
function Routine() {
    let STR_LEAD = 'lead';
    let STR_FOLLOW = 'follow';
    let lead = createDancer(STR_LEAD);
    let follow = createDancer(STR_FOLLOW);
    let stepUtil = new StepUtil();

    this.getLead = function() {
        return lead;
    }
    this.getFollow = function() {
        return follow;
    }
    this.addDancerStep = function(position,foot,beat,orientation,action,direction,isPaired) {
        var step = createStep(foot,beat,orientation,action,direction);
        switch(position) {
            case STR_LEAD:
                lead.addStep(step);
                if(isPaired) {
                    follow.addStep(stepUtil.getPartnerStep(step));
                }
                break;
            case STR_FOLLOW:
                follow.addStep(step);
                if(isPaired) {
                    lead.addStep(stepUtil.getPartnerStep(step));
                }
                break;
            default :
                console.error("System cannot add a step without a position");
        }
    }
}

let createDancer = function (position) {
    var newDancer = new Dancer();
    newDancer.setPosition(position);
    return newDancer;
}

let createStep = function(foot,beat,orientation,action,direction) {
    var newStep =  new Step();
    
    newStep.setFoot(foot);
    newStep.setBeat(beat);
    newStep.setOrnt(orientation);
    newStep.setAct(action);
    newStep.setDir(direction);
    return newStep;
}

let createStepFromString = function(stepString) {
    var utils = new StepUtil();
    var newStep = new Step();
    newStep.setFoot(stepString.match(utils.FOOT_REGEX)[0]);
    newStep.setBeat(stepString.match(utils.BEAT_REGEX)[0]);
    newStep.setOrnt(stepString.match(utils.ORTN_REGEX)[0]);
    newStep.setAct(stepString.match(utils.ACT_REGEX)[0]);
    newStep.setDir(stepString.match(utils.DIR_REGEX)[0]);
    return newStep;
}

function Dancer() {
    let position,
        steps = new Array();

    this.toString = function() {
        return `Position[${position}] with ${steps.length} steps`;
    }
    this.setPosition = function(val) {
        position = val;
    }
    this.getPosition = function() {
        return position;
    }
    this.getSteps = function() {
        return steps;
    }
    this.getStep = function(idx) {
        return steps;
    }
    this.setStep = function(idx,val) {
        steps[idx] = val;
    }
    this.addStep = function(val) {
        steps.push(val);
    }
}

function Step() {
    let foot,
        beat,
        orientation,
        action,
        direction;

    this.toString = function() {
        return foot + beat + orientation + action + direction;
    }
    this.setFoot = function(val) {
        foot = val;
    }
    this.setBeat = function(val) {
        beat = val;
    }
    this.setOrnt = function(val) {
        orientation = val;
    }
    this.setAct = function(val) {
        action = val;
    }
    this.setDir = function(val) {
        direction = val;
    }
    this.getFoot = function() {
        return foot;
    }
    this.getBeat = function() {
        return beat;
    }
    this.getOrnt = function() {
        return orientation;
    }
    this.getAct = function() {
        return action;
    }
    this.getDir = function() {
        return direction;
    }
}
//  Sample format of a fully qualified step 'L:L1eF-<'
//      Dancer : Foot Beat(2 chars) Orientation Action Direction
function StepUtil() {
    //  Tokens for determing which foot moves
    this.FOOT_REGEX = '[L|R]{1}';
    this.FOOT_LT = 'L'; //  'L' for 'Left'; When updating to Spanish 'I' for 'Izquierda'
    this.FOOT_RT = 'R'; //  'R' for 'Right'; When updating to Spanish 'D' for 'Derecha'
    //  Tokens for determining beat subdivisions
    this.BEAT_REGEX = '[0-9](_|e|\\+|a)';
    this.BEAT_FRST = '_';
    this.BEAT_SCND = 'e';
    this.BEAT_THRD = '+';
    this.BEAT_FRTH = 'a';
    //  Tokens for determining orientation of dancers, relative to the line of dance
    this.ORTN_REGEX = '(?!\\w[0-9][_|e|\\+|a])(F|B|L|R)';
    this.ORTN_FWRD = 'F';  // 'F' for 'Forward'; When updating to Spanish 'Ad' for 'Adelante'
    this.ORTN_BWRD = 'B';  // 'B' for 'Backward'; When updating to Spanish 'At' for 'Atras'
    this.ORTN_LT = 'L'; //  'L' for 'Left'; When updating to Spanish 'I' for 'Izquierda'
    this.ORTN_RT = 'R'; //  'R' for 'Right'; When updating to Spanish 'D' for 'Derecha'
    //  Tokens for determing which whether the dancer moves or stays in place
    this.ACT_REGEX = '(?!\w[0-9][_|e|\+|a]|F|B|L|R)[\W]';
    this.ACT_TRVL = '-'; //  '-' for moving in the specified fashion
    this.ACT_STAY = '_'; //  '_' for planting in the specified fashion
    //  Tokens for determing direction that dancers are moving
    this.DIR_REGEX = '.$';
    this.DIR_LT = '<';
    this.DIR_ALT = '\\';
    this.DIR_ST = '|';
    this.DIR_ART = '/';
    this.DIR_RT = '>';
    
    this.getPartnerStep = function(step) {
        let partnerStep = new Step();
        switch(step.getFoot()) {
            case this.FOOT_LT :
                partnerStep.setFoot(this.FOOT_RT);
                break;
            case this.FOOT_RT :
                partnerStep.setFoot(this.FOOT_LT);
                break;
            default :
                console.error('no foot provided');
        }
        partnerStep.setBeat(step.getBeat());
        switch(step.getOrnt()) {
            case this.ORTN_FWRD :
                partnerStep.setOrnt(this.ORTN_BWRD);
                break;
            case this.ORTN_BWRD :
                partnerStep.setOrnt(this.ORTN_FWRD);
                break;
            case this.ORTN_LT :
                partnerStep.setOrnt(this.ORTN_RT);
                break;
            case this.ORTN_RT :
                partnerStep.setOrnt(this.ORTN_LT);
                break;
            default :
                console.error('no orientation provided.');
        }
        partnerStep.setAct(step.getAct());
        partnerStep.setDir(step.getDir());
        return partnerStep;
    }
}