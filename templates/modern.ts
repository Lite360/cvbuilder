import { CVTemplateData } from './types';

export function renderModernTemplate(data: CVTemplateData): string {
  const { profile, education, experience, skills, projects, certifications } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${profile.fullName || 'Curriculum Vitae'}</title>
  <style>
    @page { size: A4; margin: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; margin: 0; display: flex; min-height: 100vh; }
    .sidebar { width: 32%; background: #0f172a; color: #f8fafc; padding: 30px 20px; box-sizing: border-box; }
    .main-content { width: 68%; padding: 30px 30px; box-sizing: border-box; }
    .avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #7c3aed; }
    .name { font-size: 22px; font-weight: 700; color: #ffffff; }
    .title { font-size: 13px; color: #a78bfa; margin-bottom: 20px; font-weight: 500; }
    .side-section { margin-bottom: 25px; }
    .side-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #c4b5fd; border-bottom: 1px solid #334155; padding-bottom: 5px; margin-bottom: 10px; }
    .side-text { font-size: 11px; color: #cbd5e1; margin-bottom: 6px; word-break: break-word; }
    .main-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7c3aed; border-bottom: 2px solid #ddd6fe; padding-bottom: 4px; margin-bottom: 14px; }
    .item { margin-bottom: 16px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; color: #0f172a; }
    .item-sub { font-size: 12px; color: #7c3aed; font-weight: 500; }
    .description { font-size: 12px; color: #334155; margin-top: 4px; }
    .badge { display: inline-block; background: #2e1065; color: #ddd6fe; font-size: 11px; padding: 4px 8px; border-radius: 4px; margin: 2px; }
  </style>
</head>
<body>
  <div class="sidebar">
    ${profile.profilePhotoUrl ? `<img src="${profile.profilePhotoUrl}" class="avatar" alt="Profile" />` : ''}
    <div class="name">${profile.fullName || 'Your Name'}</div>
    ${profile.professionalTitle ? `<div class="title">${profile.professionalTitle}</div>` : ''}

    <div class="side-section">
      <div class="side-title">Contact</div>
      ${profile.email ? `<div class="side-text">📧 ${profile.email}</div>` : ''}
      ${profile.phone ? `<div class="side-text">📱 ${profile.phone}</div>` : ''}
      ${profile.location ? `<div class="side-text">📍 ${profile.location}</div>` : ''}
      ${profile.linkedinUrl ? `<div class="side-text">🔗 ${profile.linkedinUrl}</div>` : ''}
    </div>

    ${skills.length > 0 ? `
    <div class="side-section">
      <div class="side-title">Skills</div>
      ${skills.map(s => `<div class="badge">${s.skillName}</div>`).join('')}
    </div>` : ''}
  </div>

  <div class="main-content">
    ${profile.professionalSummary ? `
    <div style="margin-bottom:20px;">
      <div class="main-title">Profile</div>
      <div class="description">${profile.professionalSummary}</div>
    </div>` : ''}

    ${experience.length > 0 ? `
    <div style="margin-bottom:20px;">
      <div class="main-title">Experience</div>
      ${experience.map(e => `
        <div class="item">
          <div class="item-header"><span>${e.jobTitle}</span><span>${e.startDate || ''} – ${e.isCurrent ? 'Present' : (e.endDate || '')}</span></div>
          <div class="item-sub">${e.company}</div>
          ${e.description ? `<div class="description">${e.description}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${education.length > 0 ? `
    <div style="margin-bottom:20px;">
      <div class="main-title">Education</div>
      ${education.map(e => `
        <div class="item">
          <div class="item-header"><span>${e.degree}</span><span>${e.startDate || ''} – ${e.endDate || ''}</span></div>
          <div class="item-sub">${e.institution}</div>
        </div>
      `).join('')}
    </div>` : ''}
  </div>
</body>
</html>
  `;
}
