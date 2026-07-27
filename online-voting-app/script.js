const STORAGE_KEY = "onlineVotingAppVotes";

const CANDIDATES = [
  "Alice Johnson",
  "Brian Smith",
  "Carla Davis",
  "Daniel Lee"
];

const elements = {
  form: document.getElementById("voteForm"),
  fullName: document.getElementById("fullName"),
  age: document.getElementById("age"),
  email: document.getElementById("email"),
  candidate: document.getElementById("candidate"),
  successBanner: document.getElementById("successBanner"),
  totalVotes: document.getElementById("totalVotes"),
  uniqueVoters: document.getElementById("uniqueVoters"),
  resultsContainer: document.getElementById("resultsContainer"),
  auditTableBody: document.getElementById("auditTableBody"),
  toggleAuditBtn: document.getElementById("toggleAuditBtn"),
  auditWrapper: document.getElementById("auditWrapper"),
  errors: {
    name: document.getElementById("nameError"),
    age: document.getElementById("ageError"),
    email: document.getElementById("emailError"),
    candidate: document.getElementById("candidateError")
  }
};

const getVotes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse votes from localStorage:", error);
    return [];
  }
};

const saveVotes = (votes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
};

const sanitizeEmail = (email) => email.trim().toLowerCase();

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const clearErrors = () => {
  Object.values(elements.errors).forEach((el) => {
    el.textContent = "";
  });
};

const hideSuccessBanner = () => {
  elements.successBanner.classList.add("hidden");
};

const showSuccessBanner = (message = "Vote submitted successfully!") => {
  elements.successBanner.textContent = message;
  elements.successBanner.classList.remove("hidden");

  setTimeout(() => {
    hideSuccessBanner();
  }, 3000);
};

const setError = (field, message) => {
  if (elements.errors[field]) {
    elements.errors[field].textContent = message;
  }
};

const validateForm = (formData, existingVotes) => {
  let isValid = true;
  clearErrors();

  const name = formData.name.trim();
  const age = Number(formData.age);
  const email = sanitizeEmail(formData.email);
  const vote = formData.vote;

  if (!name) {
    setError("name", "Full name is required.");
    isValid = false;
  }

  if (!formData.age || Number.isNaN(age)) {
    setError("age", "Age is required.");
    isValid = false;
  } else if (age < 18) {
    setError("age", "You must be at least 18 years old to vote.");
    isValid = false;
  }

  if (!formData.email.trim()) {
    setError("email", "Email address is required.");
    isValid = false;
  } else {
    const alreadyVoted = existingVotes.some(
      (entry) => sanitizeEmail(entry.email) === email
    );

    if (alreadyVoted) {
      setError("email", "This email address has already cast a vote!");
      isValid = false;
    }
  }

  if (!vote) {
    setError("candidate", "Please select a candidate.");
    isValid = false;
  }

  return isValid;
};

const calculateResults = (votes) => {
  const totalVotes = votes.length;

  const tally = CANDIDATES.map((candidate) => {
    const count = votes.filter((entry) => entry.vote === candidate).length;
    const percentage = totalVotes === 0 ? 0 : (count / totalVotes) * 100;

    return {
      candidate,
      count,
      percentage
    };
  });

  return {
    totalVotes,
    tally
  };
};

const renderResults = () => {
  const votes = getVotes();
  const { totalVotes, tally } = calculateResults(votes);

  elements.totalVotes.textContent = totalVotes;
  elements.uniqueVoters.textContent = totalVotes;

  elements.resultsContainer.innerHTML = tally
    .map(
      ({ candidate, count, percentage }) => `
        <article class="result-item">
          <div class="result-head">
            <h3>${candidate}</h3>
            <div class="result-meta">${count} vote${count !== 1 ? "s" : ""} • ${percentage.toFixed(1)}%</div>
          </div>
          <div class="progress-track" aria-label="${candidate} progress bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
        </article>
      `
    )
    .join("");
};

const renderAuditLog = () => {
  const votes = getVotes();

  if (!votes.length) {
    elements.auditTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">No votes submitted yet.</td>
      </tr>
    `;
    return;
  }

  elements.auditTableBody.innerHTML = votes
    .slice()
    .reverse()
    .map(
      ({ name, email, age, vote, timestamp }) => `
        <tr>
          <td>${name}</td>
          <td>${email}</td>
          <td>${age}</td>
          <td>${vote}</td>
          <td>${formatDateTime(timestamp)}</td>
        </tr>
      `
    )
    .join("");
};

const updateUI = () => {
  renderResults();
  renderAuditLog();
};

const resetForm = () => {
  elements.form.reset();
};

const handleSubmit = (event) => {
  event.preventDefault();
  hideSuccessBanner();

  const votes = getVotes();

  const formData = {
    name: elements.fullName.value,
    age: elements.age.value,
    email: elements.email.value,
    vote: elements.candidate.value
  };

  const isValid = validateForm(formData, votes);

  if (!isValid) return;

  const newVote = {
    name: formData.name.trim(),
    age: Number(formData.age),
    email: sanitizeEmail(formData.email),
    vote: formData.vote,
    timestamp: new Date().toISOString()
  };

  votes.push(newVote);
  saveVotes(votes);
  updateUI();
  resetForm();
  clearErrors();
  showSuccessBanner("Vote submitted successfully!");
};

const handleLiveFieldValidation = () => {
  elements.age.addEventListener("input", () => {
    const ageValue = Number(elements.age.value);

    if (elements.age.value === "") {
      elements.errors.age.textContent = "";
      return;
    }

    if (ageValue < 18) {
      elements.errors.age.textContent = "You must be at least 18 years old to vote.";
    } else {
      elements.errors.age.textContent = "";
    }
  });

  elements.email.addEventListener("input", () => {
    const emailValue = sanitizeEmail(elements.email.value);
    const votes = getVotes();

    if (!elements.email.value.trim()) {
      elements.errors.email.textContent = "";
      return;
    }

    const exists = votes.some(
      (entry) => sanitizeEmail(entry.email) === emailValue
    );

    elements.errors.email.textContent = exists
      ? "This email address has already cast a vote!"
      : "";
  });

  elements.fullName.addEventListener("input", () => {
    if (elements.fullName.value.trim()) {
      elements.errors.name.textContent = "";
    }
  });

  elements.candidate.addEventListener("change", () => {
    if (elements.candidate.value) {
      elements.errors.candidate.textContent = "";
    }
  });
};

const setupAuditToggle = () => {
  elements.toggleAuditBtn.addEventListener("click", () => {
    const isCollapsed = elements.auditWrapper.classList.contains("collapsed");

    elements.auditWrapper.classList.toggle("collapsed", !isCollapsed);
    elements.auditWrapper.classList.toggle("expanded", isCollapsed);

    elements.toggleAuditBtn.textContent = isCollapsed
      ? "Hide Audit Log"
      : "Show Audit Log";

    elements.toggleAuditBtn.setAttribute("aria-expanded", String(isCollapsed));
  });
};

const init = () => {
  updateUI();
  setupAuditToggle();
  handleLiveFieldValidation();
  elements.form.addEventListener("submit", handleSubmit);
};

document.addEventListener("DOMContentLoaded", init);
