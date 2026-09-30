// ==========================================
// 1. PASSWORD ANALYZER LOGIC (LIVE ACTIVE)
// ==========================================
const passInput = document.getElementById('passInput');
const togglePassBtn = document.getElementById('togglePassBtn');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthStatus = document.getElementById('strengthStatus');
const crackEstimate = document.getElementById('crackEstimate');

// પાસવર્ડ બતાવવા / છુપાવવા માટે (Eye Button)
if (togglePassBtn && passInput) {
  togglePassBtn.addEventListener('click', () => {
    const isPassword = passInput.getAttribute('type') === 'password';
    passInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePassBtn.innerHTML = isPassword 
      ? '<i class="fa-solid fa-eye-slash"></i>' 
      : '<i class="fa-solid fa-eye"></i>';
  });
}

// ટાઈપ કરતી વખતે લાઈવ સ્કોર અને કલર બદલવા
if (passInput) {
  passInput.addEventListener('input', () => {
    const val = passInput.value;
    let score = 0;

    if (!val) {
      if (strengthIndicator) strengthIndicator.style.width = '0%';
      if (strengthStatus) {
        strengthStatus.innerText = 'Enter text';
        strengthStatus.style.color = '#fff';
      }
      if (crackEstimate) crackEstimate.innerText = 'Crack Time: Instant';
      return;
    }

    // નિયમો: લંબાઈ, મોટો અક્ષર, નંબર, સિમ્બોલ
    if (val.length >= 8) score += 25;
    if (/[A-Z]/.test(val)) score += 25;
    if (/[0-9]/.test(val)) score += 25;
    if (/[^A-Za-z0-9]/.test(val)) score += 25;

    if (strengthIndicator) strengthIndicator.style.width = `${score}%`;

    if (score <= 25) {
      if (strengthIndicator) strengthIndicator.style.background = '#ff2b47';
      if (strengthStatus) {
        strengthStatus.innerText = 'Very Weak ❌';
        strengthStatus.style.color = '#ff2b47';
      }
      if (crackEstimate) crackEstimate.innerText = 'Crack Time: 2 Seconds';
    } else if (score <= 50) {
      if (strengthIndicator) strengthIndicator.style.background = '#f97316';
      if (strengthStatus) {
        strengthStatus.innerText = 'Moderate ⚠️';
        strengthStatus.style.color = '#f97316';
      }
      if (crackEstimate) crackEstimate.innerText = 'Crack Time: 2 Hours';
    } else if (score <= 75) {
      if (strengthIndicator) strengthIndicator.style.background = '#eab308';
      if (strengthStatus) {
        strengthStatus.innerText = 'Strong 👍';
        strengthStatus.style.color = '#eab308';
      }
      if (crackEstimate) crackEstimate.innerText = 'Crack Time: 6 Months';
    } else {
      if (strengthIndicator) strengthIndicator.style.background = '#10b981';
      if (strengthStatus) {
        strengthStatus.innerText = 'Bulletproof 🛡️';
        strengthStatus.style.color = '#10b981';
      }
      if (crackEstimate) crackEstimate.innerText = 'Crack Time: 100+ Years';
    }
  });
}

// ==========================================
// 2. PHISHING URL INSPECTOR LOGIC (ACTIVE)
// ==========================================
const inspectBtn = document.getElementById('inspectBtn');
const urlInput = document.getElementById('urlInput');
const urlReportBox = document.getElementById('urlReportBox');
const urlProtoResult = document.getElementById('urlProtoResult');
const urlPatternResult = document.getElementById('urlPatternResult');
const urlFinalVerdict = document.getElementById('urlFinalVerdict');

if (inspectBtn && urlInput) {
  inspectBtn.addEventListener('click', () => {
    const rawVal = urlInput.value.trim().toLowerCase();
    
    if (!rawVal) {
      alert("મહેરબાની કરીને પહેલા કોઈ URL અથવા Link લખો!");
      return;
    }

    if (urlReportBox) urlReportBox.classList.remove('hidden');

    const isHttps = rawVal.startsWith('https://');
    const scamWords = ['bonus', 'free', 'reward', 'login', 'verify', 'update', 'bank', 'secure', 'gift', 'win'];
    const detectedWords = scamWords.filter(w => rawVal.includes(w));

    // પ્રોટોકોલ ચેક
    if (urlProtoResult) {
      urlProtoResult.innerHTML = isHttps 
        ? '<span style="color:#10b981;">✔ SSL Protocol: Secure HTTPS Active</span>'
        : '<span style="color:#ff2b47;">✖ Unsecured Protocol: Plain HTTP Detected (Data leak risk)</span>';
    }

    // પેટર્ન ચેક
    if (urlPatternResult) {
      if (detectedWords.length > 0) {
        urlPatternResult.innerHTML = `<span style="color:#ff2b47;">✖ Phishing bait triggers found: [${detectedWords.join(', ')}]</span>`;
      } else {
        urlPatternResult.innerHTML = '<span style="color:#10b981;">✔ No common phishing keywords found</span>';
      }
    }

    // ફાઇનલ નિર્ણય (Verdict)
    if (urlFinalVerdict) {
      if (detectedWords.length > 0 || !isHttps) {
        urlFinalVerdict.innerHTML = '<span style="color:#ff2b47; font-weight:bold; font-size:1.05rem;">⚠️ Verdict: High Risk / Suspicious Website</span>';
      } else {
        urlFinalVerdict.innerHTML = '<span style="color:#10b981; font-weight:bold; font-size:1.05rem;">🛡️ Verdict: Safe / Standard URL Structure</span>';
      }
    }
  });
} 
// ==========================================
// BACKEND API CONNECTOR (PORT: 5000)
// ==========================================
const API_BASE_URL = 'http://localhost:5000/api';

// 1. Function to dispatch incident log to SOC backend
async function submitIncidentToBackend(incidentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData)
    });
    const result = await response.json();
    console.log('✅ SOC Ledger Update:', result);
  } catch (error) {
    console.warn('⚠️ Backend Offline or Unreachable:', error.message);
  }
}

// 2. Function to register quiz assessment score in database
async function saveScoreToBackend(traineeName, score) {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traineeName, score })
    });
    const result = await response.json();
    console.log('✅ Assessment Saved:', result);
  } catch (error) {
    console.warn('⚠️ Score save skipped (Backend Offline):', error.message);
  }
} 
// --- QUIZ LOGIC WITH RED/GREEN FEEDBACK ---
const quizQuestions = [
  {
    question: "What is the primary goal of a Phishing attack?",
    options: ["To speed up internet connection", "To steal sensitive credentials and personal data", "To update system software", "To scan network ports"],
    correct: 1
  },
  {
    question: "Which of the following creates a strong password defense?",
    options: ["Using birth dates", "Combining upper/lowercase, numbers, and symbols", "Reusing standard passwords everywhere", "Using easily searchable dictionary words"],
    correct: 1
  },
  {
    question: "What should you do if an unknown sender attaches an executable file (.exe)?",
    options: ["Run it immediately", "Forward it to colleagues", "Report and isolate the suspicious mail without clicking", "Change file extension"],
    correct: 2
  },
  {
    question: "What does 2FA / MFA primarily provide?",
    options: ["Faster network download speed", "An additional security barrier beyond just passwords", "Automatic email reply", "Cloud storage space"],
    correct: 1
  },
  {
    question: "Who should you notify immediately during an active enterprise ransomware breach?",
    options: ["Social Media", "The Internal IT / Blue Team SOC Response unit", "No one, ignore it", "Unknown external contractors"],
    correct: 1
  }
];

let currentQIdx = 0;
let userQuizScore = 0;

function renderQuizQuestion() {
  const current = quizQuestions[currentQIdx];
  if (!current) {
    showQuizCompletion();
    return;
  }

  const quizBox = document.getElementById('quiz') || document.querySelector('.quiz-container') || document.querySelector('.quiz-card');
  
  if (quizBox) {
    quizBox.innerHTML = `
      <div style="max-width: 650px; margin: 0 auto; padding: 25px; background: rgba(15, 23, 42, 0.75); border-radius: 14px; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
        <div style="display:flex; justify-content:space-between; margin-bottom:14px; color:#94a3b8; font-size:14px; font-weight:600;">
          <span>Question ${currentQIdx + 1} of ${quizQuestions.length}</span>
          <span>Score: ${userQuizScore}</span>
        </div>
        <h3 style="color:#ffffff; margin-bottom:20px; font-size:19px; line-height:1.4;">${current.question}</h3>
        <div id="quiz-options-group" style="display: flex; flex-direction: column; gap: 12px;">
          ${current.options.map((opt, i) => `
            <button type="button" class="soc-opt-btn" onclick="handleQuizAnswer(${i})" style="padding: 13px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: #1e293b; color: #e2e8f0; font-size: 15px; text-align: left; cursor: pointer; transition: all 0.2s ease;">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.handleQuizAnswer = function(selectedIdx) {
  const current = quizQuestions[currentQIdx];
  const buttons = document.querySelectorAll('#quiz-options-group .soc-opt-btn');

  buttons.forEach(btn => btn.style.pointerEvents = 'none');

  buttons.forEach((btn, idx) => {
    if (idx === current.correct) {
      btn.style.backgroundColor = '#10b981';
      btn.style.borderColor = '#10b981';
      btn.style.color = '#ffffff';
      btn.style.fontWeight = 'bold';
    } else if (idx === selectedIdx) {
      btn.style.backgroundColor = '#ef4444';
      btn.style.borderColor = '#ef4444';
      btn.style.color = '#ffffff';
      btn.style.fontWeight = 'bold';
    }
  });

  if (selectedIdx === current.correct) {
    userQuizScore++;
  }

  setTimeout(() => {
    currentQIdx++;
    if (currentQIdx < quizQuestions.length) {
      renderQuizQuestion();
    } else {
      showQuizCompletion();
    }
  }, 1000);
};

function showQuizCompletion() {
  const quizBox = document.getElementById('quiz') || document.querySelector('.quiz-container') || document.querySelector('.quiz-card');
  if (quizBox) {
    quizBox.innerHTML = `
      <div style="text-align: center; padding: 35px 20px; background: rgba(16, 185, 129, 0.08); border-radius: 14px; border: 1px solid #10b981; max-width: 650px; margin: 0 auto;">
        <h3 style="color: #10b981; font-size: 22px; margin-bottom: 10px;">🎯 Assessment Completed!</h3>
        <p style="color: #ffffff; font-size: 18px; margin-bottom: 12px;">Your Final Score: <strong>${userQuizScore} / ${quizQuestions.length}</strong></p>
        <p style="color: #94a3b8; font-size: 14px;">Syncing results to MongoDB SOC Ledger...</p>
      </div>
    `;
  }

  if (typeof saveScoreToBackend === 'function') {
    saveScoreToBackend('Security Trainee', userQuizScore);
  }
}

setTimeout(renderQuizQuestion, 200); 
// Threat Data
const threatData = {
  "Phishing Scams": {
    badge: "Critical Risk",
    scenario: "Users receive urgency-driven banking or invoice notifications prompting them to verify identity on deceptive mirror portals.",
    vector: "Domain spoofing, brand imitation, weaponized macro links, and urgent MFA fatigue attacks.",
    defenses: [
      "Always inspect top-level domain syntax before credential input.",
      "Deploy hardware security keys (FIDO2) or authenticator apps instead of SMS OTP.",
      "Check DKIM/SPF headers on unexpected organizational notices."
    ]
  },
  "Malware & Trojans": {
    badge: "Severe Threat",
    scenario: "Legitimate-looking downloads like game cheats, software activators, or masked PDF attachments silently deploy background processes.",
    vector: "Process hollowing, unauthorized privilege escalation, and scheduled command-and-control polling.",
    defenses: [
      "Avoid unauthorized executable software and pirated repack tools.",
      "Ensure OS real-time threat intelligence and automated patch updates are active.",
      "Enforce least-privilege user accounts for everyday computer usage."
    ]
  },
  "Password Attacks": {
    badge: "High Vulnerability",
    scenario: "Automated scripts attempt hundreds of credential permutations derived from past global data leak dumps.",
    vector: "Credential stuffing across parallel logins, dictionary attacks, and weak hashing algorithms.",
    defenses: [
      "Use unique 14+ character passphrases composed of random terms.",
      "Never reuse primary banking or email access passwords across common utility apps.",
      "Activate two-step verification for every critical account."
    ]
  },
  "Unsafe Portals & MitM": {
    badge: "Network Danger",
    scenario: "Unencrypted traffic over rogue public hotspots allows eavesdroppers to sniff authorization tokens and session identifiers.",
    vector: "Evil Twin Wi-Fi access points, ARP poisoning, and SSL stripping techniques.",
    defenses: [
      "Avoid logging into sensitive banking or business accounts over open Wi-Fi.",
      "Verify HTTPS and TLS lock symbols on all accessed web endpoints.",
      "Route critical internet sessions through verified encrypted VPN tunnels."
    ]
  }
};
// Robust Global Threat Modal Handler
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("threatModal");
  const closeBtn = document.getElementById("modalCloseBtn");

  if (!modal) return;

  // Delegation: Screen par koi pan jagyaye click thay tyare check kare
  document.addEventListener("click", (e) => {
    // Check karo ke threat card par click thayo che
    const card = e.target.closest(".threat-card, .matrix-card, [class*='card']");
    if (!card) return;

    // Card mathi heading text sodho
    const heading = card.querySelector("h2, h3, h4");
    if (!heading) return;

    const titleText = heading.textContent.trim();

    if (typeof threatData !== "undefined" && threatData[titleText]) {
      const data = threatData[titleText];

      const modalTitle = document.getElementById("modalTitle");
      const modalRisk = document.getElementById("modalRiskBadge");
      const modalScenario = document.getElementById("modalScenario");
      const modalVector = document.getElementById("modalVector");
      const listEl = document.getElementById("modalDefenseList");

      if (modalTitle) modalTitle.textContent = titleText;
      if (modalRisk) modalRisk.textContent = data.badge;
      if (modalScenario) modalScenario.textContent = data.scenario;
      if (modalVector) modalVector.textContent = data.vector;

      if (listEl) {
        listEl.innerHTML = data.defenses.map(d => `<li>${d}</li>`).join("");
      }

      modal.style.display = "flex";
    }
  });

  // Close actions
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}); 
