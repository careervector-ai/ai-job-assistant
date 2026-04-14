console.log("🔥 Popup loaded");

document.addEventListener("DOMContentLoaded", () => {
  const skillsInput = document.getElementById("skills");
  const status = document.getElementById("status");
  const saveBtn = document.getElementById("saveBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("resumeFile");

  // =======================
  // 🔄 Load saved skills
  // =======================
  chrome.storage.local.get("userSkills", (data) => {
    if (data.userSkills && data.userSkills.length > 0) {
      skillsInput.value = data.userSkills.join(", ");
    }
  });

  // =======================
  // 💾 Save manual skills
  // =======================
  saveBtn.addEventListener("click", () => {
    const skills = skillsInput.value
      .toLowerCase()
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    console.log("💾 Saving skills:", skills);

    chrome.storage.local.set({ userSkills: skills }, () => {
      if (chrome.runtime.lastError) {
        console.error("❌ Storage Error:", chrome.runtime.lastError);
        status.innerText = "❌ Error saving!";
      } else {
        console.log("✅ Skills saved");
        status.innerText = "✅ Saved successfully!";

        setTimeout(() => {
          window.close();
        }, 800);
      }
    });
  });

  // =======================
  // 📄 Upload Resume (🔥 NEW)
  // =======================
  uploadBtn.addEventListener("click", () => {
    if (!fileInput.files.length) {
      alert("Select a file first");
      return;
    }

    console.log("🚀 Upload button clicked");

    status.innerText = "⏳ Uploading...";

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const base64 = reader.result;

      chrome.runtime.sendMessage(
        {
          type: "UPLOAD_RESUME",
          fileData: base64,
          fileName: file.name
        },
        (response) => {
          console.log("✅ Response:", response);

          if (chrome.runtime.lastError) {
            console.error("❌ Runtime error:", chrome.runtime.lastError);
            status.innerText = "❌ Extension error";
            return;
          }

          if (response && response.skills) {
            chrome.storage.local.set({ userSkills: response.skills }, () => {
              console.log("✅ Skills saved from resume");

              skillsInput.value = response.skills.join(", ");
              status.innerText = "✅ Resume processed!";

              setTimeout(() => {
                window.close();
              }, 1200);
            });
          } else {
            status.innerText = "❌ " + (response?.error || "Upload failed");
            console.error("FULL ERROR:", response);
          }
        }
      );
    };

    reader.readAsDataURL(file);
  });
});