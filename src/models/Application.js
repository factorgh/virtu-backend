import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    location: { type: String },
    preferredHours: { type: String },
    availability: { type: String }
  },

  professionalBackground: {
    employmentStatus: { type: String },
    yearsExperience: { type: String },
    skills: [{ type: String }],
    specializations: [{ type: String }],
    previousVAExperience: { type: String }
  },

  technicalProficiency: {
    computerSkills: { type: String },
    softwareProficiency: {
      "office-Word": { type: String },
      "office-Excel": { type: String },
      "office-PowerPoint": { type: String },
      "google-Gmail": { type: String },
      "google-Docs": { type: String },
      "google-Sheets": { type: String },
      "design-Photoshop": { type: String },
      "design-Canva": { type: String },
      "crm-Salesforce": { type: String },
      "crm-HubSpot": { type: String },
      "crm-Pipedrive": { type: String },
      "project-Asana": { type: String },
      "project-Trello": { type: String },
      "project-Monday.com": { type: String },
      "social-Hootsuite": { type: String },
      "social-Buffer": { type: String },
      "social-Sprout Social": { type: String }
    },
    languageProficiency: {
      english: { type: String },
      french: { type: String },
      spanish: { type: String }
    },
    communicationTools: [{ type: String }],
    timeZone: { type: String }
  },

  educationalBackground: {
    education: { type: String },
    certifications: [{ type: String }],
    training: [{ type: String }],
    continuingEducation: { type: String },
    coursework: [{ type: String }]
  },

  workPreferences: {
    projectTypes: [{ type: String }],
    remoteExperience: { type: String },
    communicationPreferences: [{ type: String }],
    collaborationStyle: { type: String },
    projectManagementTools: [{ type: String }]
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
