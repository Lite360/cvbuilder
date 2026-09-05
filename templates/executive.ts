import { CVTemplateData } from './types';

export function renderExecutiveTemplate(data: CVTemplateData): string {
  const { profile, education, experience, skills, projects, certifications } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${profile.fullName || 'Curriculum Vitae'}</title>
  <style>
    @page { size: A4; margin: 0; }
    body { font-family: Georgia, serif; color: #1e293b; line-height: 1.5; margin: 0; background: #fff; }
    .top-banner { background: #0f766e; color: #ffffff; padding: 30px 40px; }
    .name { font-size: 32px; font-weight: 700; font-family: sans-serif; letter-spacing: 0.5px; }
    .title { font-size: 16px; color: #99f6e4; font-weight: 400; margin-top: 4px; font-style: italic; }
    .contact-row { display: flex; flex-wrap: wrap; gap: 20px; font-size: 12px; margin-top: 15px; color: #ccfbf1; font-family: sans-serif; }
    .content-container { display: flex; padding: 30px 40px; gap: 30px; }
    .main-col { flex: 2; }
    .side-col { flex: 1; border-left: 1px solid #ccfbf1; padding-left: 20px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0f766e; font-family: sans-serif; border-bottom: 2px solid #0f766e; padding-bottom: 4px; margin-bottom: 12px; }
    .item { margin-bottom: 16px; }
    .item-header { font-weight: bold; font-size: 13px; color: #0f172a; display: flex; justify-content: space-between; }
    .item-sub { font-size: 12px; color: #14b8a6; font-style: italic; margin-bottom: 4px; }
    .description { font-size: 12px; color: #334155; }
    .side-item { margin-bottom: 12px; font-size: 12px; font-family: sans-serif; }
  </style>
</head>
<body>
  <div class="top-banner">
    <div class="name">${profile.fullName || 'Your Name'}</div>
    ${profile.professionalTitle ? `<div class="title">${profile.professionalTitle}</div>` : ''}
    <div class="contact-row">
      ${profile.email ? `<div>${profile.email}</div>` : ''}
      ${profile.phone ? `<div>${profile.phone}</div>` : ''}
      ${profile.location ? `<div>${profile.location}</div>` : ''}
      ${profile.linkedinUrl ? `<div>${profile.linkedinUrl}</div>` : ''}
    </div>
  </div>

  <div class="content-container">
    <div class="main-col">
      ${profile.professionalSummary ? `
      <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="description">${profile.professionalSummary}</div>
      </div>` : ''}

      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Leadership & Professional Experience</div>
        ${experience.map(e => `
          <div class="item">
            <div class="item-header"><span>${e.jobTitle}</span><span>${e.startDate || ''} – ${e.isCurrent ? 'Present' : (e.endDate || '')}</span></div>
            <div class="item-sub">${e.company} ${e.location ? `| ${e.location}` : ''}</div>
            ${e.description ? `<div class="description">${e.description}</div>` : ''}
            ${e.bulletPoints && e.bulletPoints.length > 0 ? `<ul style="font-size:12px; margin-top:4px;">${e.bulletPoints.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
    </div>

    <div class="side-col">
      ${education.length > 0 ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map(e => `
          <div class="side-item">
            <strong>${e.degree}</strong><br/>
            <span>${e.institution}</span><br/>
            <span style="color:#64748b">${e.startDate || ''} – ${e.endDate || ''}</span>
          </div>
        `).join('')}
      </div>` : ''}

      ${skills.length > 0 ? `
      <div class="section">
        <div class="section-title">Competencies</div>
        ${skills.map(s => `
          <div class="side-item">
            <strong>${s.skillName}</strong><br/>
            <span style="color:#0f766e">${s.proficiencyLevel}</span>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}
