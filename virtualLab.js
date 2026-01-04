// State management for titration experiment
let titrationState = {
    hasConicalFlask: false,
    hasAcid: false,
    hasBurette: false,
    hasBase: false,
    hasIndicator: false,
    hasDropper: false,
    acidVolume: 25,
    baseAdded: 0,
    experimentComplete: false
};

// State for precipitation experiment
let precipitationState = {
    hasTestTube: false,
    hasTestTubeStand: false,
    hasSaltA: false,
    hasSaltB: false,
    hasDropper: false,
    precipitateFormed: false,
    experimentComplete: false
};

// State for pH experiment
let pHState = {
    hasTestTube: false,
    hasTestTubeStand: false,
    hasTestSolution: false,
    hasIndicator: false,
    hasDropper: false,
    solutionType: null,
    solutionColor: null,
    solutionName: null,
    experimentComplete: false
};

// AI Assistant function with conversation history
let conversationHistory = {
    titration: [],
    precipitation: [],
    pH: []
};

async function sendMessageToAI(userAction, experimentType) {
    const chatBox = document.getElementById(`${experimentType}AiAssistantChatBox`) || 
                    document.getElementById('fromScratchAI');
    
    addAIMessage("Thinking...", chatBox, true);
    
    try {
        // Build conversation history
        const messages = [];
        
        // Add previous conversation
        if (conversationHistory[experimentType]) {
            conversationHistory[experimentType].forEach(msg => {
                messages.push(msg);
            });
        }
        
        // Add current user action
        const currentState = getStateForExperiment(experimentType);
        const userMessage = `Student performed this action: ${userAction}. Current experiment state: ${JSON.stringify(currentState)}`;
        messages.push({ role: "user", content: userMessage });
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                system: `You are an enthusiastic chemistry lab instructor helping students perform virtual ${experimentType} experiments. 
                
Your role:
- Provide brief, encouraging guidance (2-3 sentences max)
- If the action is correct: Praise them and tell them what to do next
- If the action is wrong: Gently correct them and explain why
- If they're trying to add something already present: Remind them it's already there
- Be educational but friendly and encouraging
- Reference the specific chemicals and apparatus by name
- Explain what's happening chemically when reactions occur

Keep responses concise and actionable.`,
                messages: messages
            })
        });
        
        const data = await response.json();
        const aiResponse = data.content[0].text;
        
        // Store in conversation history
        conversationHistory[experimentType].push({ role: "user", content: userMessage });
        conversationHistory[experimentType].push({ role: "assistant", content: aiResponse });
        
        // Remove loading message and add actual response
        removeLoadingMessage(chatBox);
        addAIMessage(aiResponse, chatBox);
        
    } catch (error) {
        console.error("AI Error:", error);
        removeLoadingMessage(chatBox);
        addAIMessage("I'm here to help! Continue with your experiment.", chatBox);
    }
}

function getStateForExperiment(type) {
    if (type === 'titration') return titrationState;
    if (type === 'precipitation') return precipitationState;
    if (type === 'pH') return pHState;
    return {};
}

function addAIMessage(message, chatBox, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isLoading ? 'aiMessage loading' : 'aiMessage';
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoadingMessage(chatBox) {
    const loadingMsg = chatBox.querySelector('.aiMessage.loading');
    if (loadingMsg) loadingMsg.remove();
}

function getCurrentExperiment() {
    if (document.getElementById('titrationExperimentVirtualLab').style.display === 'block') return 'titration';
    if (document.getElementById('precipitationExperimentVirtualLab').style.display === 'block') return 'precipitation';
    if (document.getElementById('pHExperimentVirtualLab').style.display === 'block') return 'pH';
    return 'fromScratch';
}

// ========== TITRATION EXPERIMENT ==========

function addConicalFlask() {
    const exp = getCurrentExperiment();
    
    if (exp === 'titration') {
        if (titrationState.hasConicalFlask) {
            sendMessageToAI("tried to add another conical flask", "titration");
            return;
        }
        
        const table = document.getElementById('titrationTable');
        const flask = document.createElement('div');
        flask.id = 'conicalFlask';
        flask.innerHTML = `
            <img src="Icons/Conical Flask.png" style="height: 150px; position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);">
            <div id="flaskContent" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 80px; height: 0; background: transparent; border-radius: 40px 40px 0 0; transition: all 0.5s;"></div>
        `;
        table.appendChild(flask);
        
        titrationState.hasConicalFlask = true;
        sendMessageToAI("added conical flask to the table", "titration");
    } else if (exp === 'precipitation' || exp === 'pH') {
        sendMessageToAI("added conical flask, but this experiment uses a test tube instead", exp);
    }
}

function addAcid() {
    if (!titrationState.hasConicalFlask) {
        sendMessageToAI("tried to add acid without conical flask first", "titration");
        return;
    }
    
    if (titrationState.hasAcid) {
        sendMessageToAI("tried to add acid again when it's already in the flask", "titration");
        return;
    }
    
    const table = document.getElementById('titrationTable');
    const acidBottle = document.createElement('img');
    acidBottle.src = 'Icons/Acid.png';
    acidBottle.style.cssText = 'height: 100px; position: absolute; top: 100px; left: 60%; animation: pourLiquid 1.5s;';
    table.appendChild(acidBottle);
    
    setTimeout(() => {
        document.getElementById('flaskContent').style.height = '60px';
        document.getElementById('flaskContent').style.background = 'rgba(255, 200, 200, 0.7)';
        acidBottle.remove();
        titrationState.hasAcid = true;
        sendMessageToAI("successfully added hydrochloric acid to the conical flask", "titration");
    }, 1500);
}

function addBurette() {
    if (!titrationState.hasAcid) {
        sendMessageToAI("tried to add burette before adding the acid to the flask", "titration");
        return;
    }
    
    if (titrationState.hasBurette) {
        sendMessageToAI("tried to add another burette when one is already set up", "titration");
        return;
    }
    
    const table = document.getElementById('titrationTable');
    const burette = document.createElement('div');
    burette.id = 'burette';
    burette.innerHTML = `
        <img src="Icons/Burette.png" style="height: 280px; position: absolute; top: 50px; left: 50%; transform: translateX(-50%);">
        <div id="buretteContent" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 18px; height: 180px; background: transparent; transition: all 0.3s;"></div>
    `;
    table.appendChild(burette);
    
    titrationState.hasBurette = true;
    sendMessageToAI("successfully positioned burette above the conical flask", "titration");
}

function addBase() {
    if (!titrationState.hasBurette) {
        sendMessageToAI("tried to add base without setting up the burette first", "titration");
        return;
    }
    
    if (titrationState.hasBase) {
        sendMessageToAI("tried to add base again when the burette is already filled", "titration");
        return;
    }
    
    const table = document.getElementById('titrationTable');
    const baseBottle = document.createElement('img');
    baseBottle.src = 'Icons/Base.png';
    baseBottle.style.cssText = 'height: 100px; position: absolute; top: -80px; left: 40%; animation: fillBurette 1.5s;';
    table.appendChild(baseBottle);
    
    setTimeout(() => {
        document.getElementById('buretteContent').style.background = 'rgba(200, 200, 255, 0.8)';
        baseBottle.remove();
        titrationState.hasBase = true;
        sendMessageToAI("successfully filled the burette with sodium hydroxide base solution", "titration");
    }, 1500);
}

function addIndicator() {
    const exp = getCurrentExperiment();
    
    if (exp === 'titration') {
        if (!titrationState.hasBase) {
            sendMessageToAI("tried to add indicator before completing the setup (need base in burette)", "titration");
            return;
        }
        
        if (titrationState.hasIndicator) {
            if (!titrationState.experimentComplete) {
                startTitration();
            } else {
                sendMessageToAI("tried to add indicator again but the experiment is already complete", "titration");
            }
            return;
        }
        
        const table = document.getElementById('titrationTable');
        const indicatorBottle = document.createElement('img');
        indicatorBottle.src = 'Icons/Indicator.png';
        indicatorBottle.style.cssText = 'height: 80px; position: absolute; top: 200px; left: 60%; animation: addDrops 1.5s;';
        table.appendChild(indicatorBottle);
        
        setTimeout(() => {
            document.getElementById('flaskContent').style.background = 'rgba(255, 180, 200, 0.7)';
            indicatorBottle.remove();
            titrationState.hasIndicator = true;
            document.getElementById('conicalFlask').style.cursor = 'pointer';
            document.getElementById('conicalFlask').onclick = startTitration;
            sendMessageToAI("successfully added phenolphthalein indicator to the acid solution - ready to begin titration", "titration");
        }, 1500);
    } else if (exp === 'pH') {
        addPHIndicator();
    }
}

function startTitration() {
    if (!titrationState.hasIndicator || titrationState.experimentComplete) return;
    
    sendMessageToAI("clicked on the flask to begin adding base from the burette", "titration");
    
    const interval = setInterval(() => {
        if (titrationState.baseAdded >= 25) {
            clearInterval(interval);
            completeTitration();
            return;
        }
        
        titrationState.baseAdded += 0.5;
        
        const buretteHeight = 180 - (titrationState.baseAdded * 7.2);
        document.getElementById('buretteContent').style.height = Math.max(0, buretteHeight) + 'px';
        
        const percent = (titrationState.baseAdded / 25) * 100;
        const flask = document.getElementById('flaskContent');
        
        if (percent < 95) {
            flask.style.background = `rgba(255, ${180 + percent * 0.4}, 200, 0.7)`;
        } else if (percent < 100) {
            flask.style.background = `rgba(255, 220, ${200 + percent}, 0.7)`;
        } else {
            flask.style.background = 'rgba(255, 100, 200, 0.9)';
        }
        
        const currentHeight = parseInt(flask.style.height);
        flask.style.height = (currentHeight + 0.2) + 'px';
    }, 100);
}

function completeTitration() {
    titrationState.experimentComplete = true;
    document.getElementById('flaskContent').style.background = 'rgba(255, 100, 200, 0.9)';
    const concentration = (0.1 * 25) / 25;
    sendMessageToAI(`reached the endpoint! The solution turned bright pink. Used 25mL of base. Calculated acid concentration is ${concentration.toFixed(3)} M`, "titration");
}

function resetTitrationState() {
    titrationState = {
        hasConicalFlask: false,
        hasAcid: false,
        hasBurette: false,
        hasBase: false,
        hasIndicator: false,
        hasDropper: false,
        acidVolume: 25,
        baseAdded: 0,
        experimentComplete: false
    };
    
    conversationHistory.titration = [];
    
    document.getElementById('titrationTable').innerHTML = '';
    document.getElementById('titrationAiAssistantChatBox').innerHTML = '<div class="aiMessage"><p>Hello! I\'m your AI lab assistant. Let\'s start fresh with the titration experiment. Please add the conical flask to the table first.</p></div>';
}

function resetPrecipitationState() {
    precipitationState = {
        hasTestTube: false,
        hasTestTubeStand: false,
        hasSaltA: false,
        hasSaltB: false,
        hasDropper: false,
        precipitateFormed: false,
        experimentComplete: false
    };
    
    conversationHistory.precipitation = [];
    
    document.getElementById('precipitationTable').innerHTML = '';
    document.getElementById('precipitationAiAssistantChatBox').innerHTML = '<div class="aiMessage"><p>Hello! I\'m your AI lab assistant. Let\'s start the precipitation experiment. Please add the test tube to the table first.</p></div>';
}

function resetPHState() {
    pHState = {
        hasTestTube: false,
        hasTestTubeStand: false,
        hasTestSolution: false,
        hasIndicator: false,
        hasDropper: false,
        solutionType: null,
        solutionColor: null,
        solutionName: null,
        experimentComplete: false
    };
    
    conversationHistory.pH = [];
    
    document.getElementById('pHTable').innerHTML = '';
    document.getElementById('pHAiAssistantChatBox').innerHTML = '<div class="aiMessage"><p>Hello! I\'m your AI lab assistant. Let\'s start the pH indicator experiment. Please add the test tube to the table first.</p></div>';
}

function addDropper() {
    const exp = getCurrentExperiment();
    const table = document.getElementById(exp + 'Table') || document.getElementById('titrationTable');
    
    if (exp === 'titration' && !titrationState.hasDropper) {
        const dropper = document.createElement('img');
        dropper.src = 'Icons/Dropper.png';
        dropper.style.cssText = 'height: 80px; position: absolute; bottom: 30px; right: 100px;';
        table.appendChild(dropper);
        titrationState.hasDropper = true;
        sendMessageToAI("added a dropper to the workspace", "titration");
    } else if (exp === 'precipitation' && !precipitationState.hasDropper) {
        const dropper = document.createElement('img');
        dropper.src = 'Icons/Dropper.png';
        dropper.style.cssText = 'height: 80px; position: absolute; bottom: 30px; right: 100px;';
        table.appendChild(dropper);
        precipitationState.hasDropper = true;
        sendMessageToAI("added a dropper to the workspace", "precipitation");
    } else if (exp === 'pH' && !pHState.hasDropper) {
        const dropper = document.createElement('img');
        dropper.src = 'Icons/Dropper.png';
        dropper.style.cssText = 'height: 80px; position: absolute; bottom: 30px; right: 100px;';
        table.appendChild(dropper);
        pHState.hasDropper = true;
        sendMessageToAI("added a dropper to the workspace", "pH");
    } else {
        sendMessageToAI("tried to add another dropper when one is already present", exp);
    }
}

// ========== PRECIPITATION EXPERIMENT ==========

function addTestTube() {
    const exp = getCurrentExperiment();
    
    if (exp === 'precipitation') {
        if (precipitationState.hasTestTube) {
            sendMessageToAI("tried to add another test tube when one is already present", "precipitation");
            return;
        }
        
        const table = document.getElementById('precipitationTable');
        const testTube = document.createElement('div');
        testTube.id = 'testTube';
        testTube.innerHTML = `
            <img src="Icons/TestTube.png" style="height: 150px; position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);">
            <div id="testTubeContent" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 30px; height: 0; background: transparent; transition: all 0.5s;"></div>
        `;
        table.appendChild(testTube);
        
        precipitationState.hasTestTube = true;
        sendMessageToAI("successfully added test tube to the table", "precipitation");
    } else if (exp === 'pH') {
        if (pHState.hasTestTube) {
            sendMessageToAI("tried to add another test tube when one is already present", "pH");
            return;
        }
        
        const table = document.getElementById('pHTable');
        const testTube = document.createElement('div');
        testTube.id = 'testTube';
        testTube.innerHTML = `
            <img src="Icons/TestTube.png" style="height: 150px; position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);">
            <div id="testTubeContent" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 30px; height: 0; background: transparent; transition: all 0.5s;"></div>
        `;
        table.appendChild(testTube);
        
        pHState.hasTestTube = true;
        sendMessageToAI("successfully added test tube to the table", "pH");
    }
}

function addTestTubeStand() {
    const exp = getCurrentExperiment();
    
    if (exp === 'precipitation') {
        if (precipitationState.hasTestTubeStand) {
            sendMessageToAI("tried to add another test tube stand when one is already present", "precipitation");
            return;
        }
        
        const table = document.getElementById('precipitationTable');
        const stand = document.createElement('img');
        stand.src = 'Icons/TestTubeStand.png';
        stand.style.cssText = 'height: 100px; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);';
        table.appendChild(stand);
        
        precipitationState.hasTestTubeStand = true;
        sendMessageToAI("successfully added test tube stand", "precipitation");
    } else if (exp === 'pH') {
        if (pHState.hasTestTubeStand) {
            sendMessageToAI("tried to add another test tube stand when one is already present", "pH");
            return;
        }
        
        const table = document.getElementById('pHTable');
        const stand = document.createElement('img');
        stand.src = 'Icons/TestTubeStand.png';
        stand.style.cssText = 'height: 100px; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);';
        table.appendChild(stand);
        
        pHState.hasTestTubeStand = true;
        sendMessageToAI("successfully added test tube stand", "pH");
    }
}

function addSaltSolutionA() {
    if (!precipitationState.hasTestTube) {
        sendMessageToAI("tried to add salt solution without having a test tube ready", "precipitation");
        return;
    }
    
    if (precipitationState.hasSaltA) {
        sendMessageToAI("tried to add Salt Solution A again when it's already in the test tube", "precipitation");
        return;
    }
    
    const table = document.getElementById('precipitationTable');
    const saltBottle = document.createElement('img');
    saltBottle.src = 'Icons/SaltSolutionA.png';
    saltBottle.style.cssText = 'height: 100px; position: absolute; top: 100px; left: 60%; animation: pourLiquid 1.5s;';
    table.appendChild(saltBottle);
    
    setTimeout(() => {
        document.getElementById('testTubeContent').style.height = '50px';
        document.getElementById('testTubeContent').style.background = 'rgba(200, 220, 255, 0.7)';
        saltBottle.remove();
        precipitationState.hasSaltA = true;
        sendMessageToAI("successfully added Silver Nitrate (AgNO₃) solution to the test tube", "precipitation");
    }, 1500);
}

function addSaltSolutionB() {
    if (!precipitationState.hasSaltA) {
        sendMessageToAI("tried to add Salt Solution B before adding Salt Solution A", "precipitation");
        return;
    }
    
    if (precipitationState.hasSaltB) {
        sendMessageToAI("tried to add Salt Solution B again - the precipitate has already formed", "precipitation");
        return;
    }
    
    const table = document.getElementById('precipitationTable');
    const saltBottle = document.createElement('img');
    saltBottle.src = 'Icons/SaltSolutionB.png';
    saltBottle.style.cssText = 'height: 100px; position: absolute; top: 100px; left: 60%; animation: pourLiquid 1.5s;';
    table.appendChild(saltBottle);
    
    setTimeout(() => {
        const tube = document.getElementById('testTubeContent');
        tube.style.height = '70px';
        saltBottle.remove();
        
        setTimeout(() => {
            tube.style.background = 'rgba(240, 240, 240, 0.9)';
            tube.style.boxShadow = 'inset 0 -20px 10px rgba(255, 255, 255, 0.8)';
            precipitationState.precipitateFormed = true;
            precipitationState.experimentComplete = true;
            sendMessageToAI("added Sodium Chloride (NaCl) solution and observed the formation of white silver chloride precipitate", "precipitation");
        }, 800);
    }, 1500);
    
    precipitationState.hasSaltB = true;
}

// ========== pH EXPERIMENT ==========

function addTestSolution() {
    if (!pHState.hasTestTube) {
        sendMessageToAI("tried to add test solution without having a test tube ready", "pH");
        return;
    }
    
    if (pHState.hasTestSolution) {
        sendMessageToAI("tried to add test solution again when it's already in the test tube", "pH");
        return;
    }
    
    // Randomly select solution type
    const solutions = [
        { type: 'acidic', color: 'rgba(220, 220, 220, 0.6)', name: 'Hydrochloric Acid (HCl)', indicatorColor: 'rgba(255, 100, 100, 0.8)', indicatorName: 'RED', pH: '2-3' },
        { type: 'acidic', color: 'rgba(230, 230, 220, 0.6)', name: 'Vinegar (Acetic Acid)', indicatorColor: 'rgba(255, 150, 100, 0.8)', indicatorName: 'ORANGE', pH: '4-5' },
        { type: 'neutral', color: 'rgba(220, 230, 240, 0.6)', name: 'Pure Water', indicatorColor: 'rgba(100, 200, 100, 0.8)', indicatorName: 'GREEN', pH: '7' },
        { type: 'basic', color: 'rgba(210, 220, 230, 0.6)', name: 'Sodium Hydroxide (NaOH)', indicatorColor: 'rgba(100, 100, 255, 0.8)', indicatorName: 'BLUE', pH: '12-13' },
        { type: 'basic', color: 'rgba(220, 215, 230, 0.6)', name: 'Soap Solution', indicatorColor: 'rgba(150, 100, 255, 0.8)', indicatorName: 'PURPLE', pH: '9-10' }
    ];
    
    const randomSolution = solutions[Math.floor(Math.random() * solutions.length)];
    pHState.solutionType = randomSolution.type;
    pHState.solutionColor = randomSolution.color;
    pHState.solutionName = randomSolution.name;
    pHState.indicatorColor = randomSolution.indicatorColor;
    pHState.indicatorName = randomSolution.indicatorName;
    pHState.pH = randomSolution.pH;
    
    const table = document.getElementById('pHTable');
    const solutionBottle = document.createElement('img');
    solutionBottle.src = 'Icons/TestSolution.png';
    solutionBottle.style.cssText = 'height: 100px; position: absolute; top: 100px; left: 60%; animation: pourLiquid 1.5s;';
    table.appendChild(solutionBottle);
    
    setTimeout(() => {
        document.getElementById('testTubeContent').style.height = '50px';
        document.getElementById('testTubeContent').style.background = randomSolution.color;
        solutionBottle.remove();
        pHState.hasTestSolution = true;
        sendMessageToAI("added an unknown test solution to the test tube - it looks clear/colorless", "pH");
    }, 1500);
}

function addPHIndicator() {
    if (!pHState.hasTestSolution) {
        sendMessageToAI("tried to add pH indicator without having a test solution in the tube", "pH");
        return;
    }
    
    if (pHState.hasIndicator) {
        sendMessageToAI("tried to add pH indicator again when it's already been added and the test is complete", "pH");
        return;
    }
    
    const table = document.getElementById('pHTable');
    const indicatorBottle = document.createElement('img');
    indicatorBottle.src = 'Icons/Indicator.png';
    indicatorBottle.style.cssText = 'height: 80px; position: absolute; top: 100px; left: 60%; animation: addDrops 1.5s;';
    table.appendChild(indicatorBottle);
    
    setTimeout(() => {
        indicatorBottle.remove();
        
        setTimeout(() => {
            const tube = document.getElementById('testTubeContent');
            tube.style.background = pHState.indicatorColor;
            pHState.colorChanged = true;
            pHState.experimentComplete = true;
            
            sendMessageToAI(`added universal indicator and observed the solution turned ${pHState.indicatorName} - the solution was ${pHState.solutionName} with pH ${pHState.pH}`, "pH");
        }, 500);
    }, 1500);
    
    pHState.hasIndicator = true;
}

function addBeaker() {
    const exp = getCurrentExperiment();
    sendMessageToAI("added a beaker to the workspace", exp);
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    .aiMessage {
        background: white;
        color: black;
        padding: 10px;
        margin: 5px 0;
        border-radius: 8px;
        border-left: 4px solid #4CAF50;
        animation: slideIn 0.3s;
    }
    
    .aiMessage.loading {
        border-left-color: #FFA500;
        animation: pulse 1s infinite;
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes pourLiquid {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(20px) rotate(-15deg); }
        100% { transform: translateY(0) rotate(0deg); opacity: 0; }
    }
    
    @keyframes fillBurette {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(10px) rotate(-10deg); }
        100% { transform: translateY(0) rotate(0deg); opacity: 0; }
    }
    
    @keyframes addDrops {
        0% { transform: translateY(0); }
        50% { transform: translateY(15px); }
        100% { transform: translateY(0); opacity: 0; }
    }
`;
document.head.appendChild(style);

/************************************************************
 * AI ENHANCEMENT LAYER (VISUAL-SAFE)
 * Does NOT touch any visual / animation logic
 ************************************************************/

/* ---------- GLOBAL AI CONTEXT ---------- */
let activeExperiment = null;

/* ---------- SET CONTEXT (called on lab open) ---------- */
function setActiveExperiment(exp) {
    activeExperiment = exp;
}

/* ---------- CHATBOX RESOLVER ---------- */
function getAIChatBox() {
    switch (activeExperiment) {
        case "titration":
            return document.getElementById("titrationAiAssistantChatBox");
        case "precipitation":
            return document.getElementById("precipitationAiAssistantChatBox");
        case "pH":
            return document.getElementById("pHAiAssistantChatBox");
        case "fromScratch":
            return document.getElementById("fromScratchAI");
        default:
            return null;
    }
}

/* ---------- CONVERSATION MEMORY ---------- */
const aiMemory = {
    titration: [],
    precipitation: [],
    pH: [],
    fromScratch: []
};

/* ---------- AI RESPONSE ENGINE ---------- */
function generateAIResponse(action) {
    const rules = {
        titration: {
            acid: "Good. Acid is taken in the conical flask before titration.",
            indicator: "Indicator helps us visually detect the endpoint.",
            base: "Base is added from the burette slowly during titration.",
            start: "Observe carefully. The endpoint is near when the color persists.",
            repeat: "This step has already been performed.",
            wrong: "That step is out of sequence in titration."
        },
        precipitation: {
            saltA: "First salt solution provides one set of ions.",
            saltB: "Good. The second solution causes an insoluble precipitate.",
            wrong: "Ensure the test tube and first solution are present."
        },
        pH: {
            solution: "Test solution added. Now use an indicator.",
            indicator: "Color change helps determine acidic or basic nature.",
            wrong: "Indicator is used only after adding the test solution."
        },
        fromScratch: {
            default: "Think about the reaction you want to observe and proceed carefully."
        }
    };

    const expRules = rules[activeExperiment];
    if (!expRules) return "Proceed carefully.";

    if (action.includes("acid")) return expRules.acid || expRules.wrong;
    if (action.includes("indicator")) return expRules.indicator || expRules.wrong;
    if (action.includes("base")) return expRules.base || expRules.wrong;
    if (action.includes("salt")) return expRules.saltB || expRules.saltA;
    if (action.includes("start")) return expRules.start;

    return expRules.default || expRules.wrong;
}

/* ---------- MAIN AI ENTRY POINT ---------- */
/* ❗ Function name UNCHANGED */
async function sendMessageToAI(userAction) {
    const chatBox = getAIChatBox();
    if (!chatBox) return;

    // thinking indicator
    const thinking = document.createElement("div");
    thinking.className = "aiMessage thinking";
    thinking.innerHTML = "<p>Thinking...</p>";
    chatBox.appendChild(thinking);
    chatBox.scrollTop = chatBox.scrollHeight;

    aiMemory[activeExperiment].push({
        role: "user",
        content: userAction
    });

    // simulate AI delay (OpenAI ready)
    setTimeout(() => {
        thinking.remove();

        const reply = generateAIResponse(userAction);

        const msg = document.createElement("div");
        msg.className = "aiMessage";
        msg.innerHTML = `<p>${reply}</p>`;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;

        aiMemory[activeExperiment].push({
            role: "assistant",
            content: reply
        });
    }, 600);
}

/************************************************************
 * END OF AI LAYER
 * All visual & animation functions remain UNTOUCHED
 ************************************************************/
