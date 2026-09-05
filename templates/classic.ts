import { CVTemplateData } from './types';

export function renderClassicTemplate(data: CVTemplateData): string {
  const { profile, education, experience, skills, projects, certifications } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${profile.fullName || 'Curriculum Vitae'}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      color: #1e293b;
      line-height: 1.5;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .name {
      font-size: 26px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    .title {
      font-size: 16px;
      font-style: italic;
      color: #475569;
      margin-top: 4px;
    }
    .contact {
      font-size: 12px;
      color: #334155;
      margin-top: 8px;
    }
    .contact span {
      margin: 0 6px;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 10px;
      color: #0f172a;
    }
    .item {
      margin-bottom: 12px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 13px;
    }
    .item-sub {
      font-style: italic;
      font-size: 12px;
      color: #475569;
      margin-bottom: 4px;
    }
    .description {
      font-size: 12px;
      color: #334155;
    }
    ul.bullets {
      margin: 4px 0 0 18px;
      padding: 0;
      font-size: 12px;
    }
    ul.bullets li {
      margin-bottom: 3px;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 12px;
    }
    .skill-badge {
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${profile.fullName || 'Your Name'}</div>
    ${profile.professionalTitle ? `<div class="title">${profile.professionalTitle}</div>` : ''}
    <div class="contact">
      ${profile.email ? `<span>${profile.email}</span>` : ''}
      ${profile.phone ? `<span>| ${profile.phone}</span>` : ''}
      ${profile.location ? `<span>| ${profile.location}</span>` : ''}
      ${profile.linkedinUrl ? `<span>| ${profile.linkedinUrl}</span>` : ''}
    </div>
  </div>

  ${profile.professionalSummary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="description">${profile.professionalSummary}</div>
  </div>` : ''}

  ${experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <span>${exp.jobTitle} - ${exp.company}</span>
          <span>${exp.startDate || ''} ${exp.startDate ? '–' : ''} ${exp.isCurrent ? 'Present' : (exp.endDate || '')}</span>
        </div>
        ${exp.location ? `<div class="item-sub">${exp.location}</div>` : ''}
        ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
        ${exp.bulletPoints && exp.bulletPoints.length > 0 ? `
          <ul class="bullets">
            ${exp.bulletPoints.map(bp => `<li>${bp}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map(edu => `
      <div class="item">
        <div class="item-header">
          <span>${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
          <span>${edu.startDate || ''} ${edu.startDate ? '–' : ''} ${edu.endDate || ''}</span>
        </div>
        <div class="item-sub">${edu.institution} ${edu.grade ? `(Grade: ${edu.grade})` : ''}</div>
        ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills & Proficiencies</div>
    <div class="skills-grid">
      ${skills.map(s => `<div class="skill-badge"><strong>${s.skillName}</strong> (${s.proficiencyLevel})</div>`).join('')}
    </div>
  </div>` : ''}

  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(p => `
      <div class="item">
        <div class="item-header">
          <span>${p.projectName}</span>
          ${p.projectUrl ? `<span><a href="${p.projectUrl}">${p.projectUrl}</a></span>` : ''}
        </div>
        ${p.technologies ? `<div class="item-sub">Technologies: ${p.technologies}</div>` : ''}
        ${p.description ? `<div class="description">${p.description}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certifications.map(c => `
      <div class="item">
        <div class="item-header">
          <span>${c.name} - ${c.issuingOrganization || ''}</span>
          <span>${c.issueDate || ''}</span>
        </div>
        ${c.credentialId ? `<div class="item-sub">Credential ID: ${c.credentialId}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}
</body>
</html>
  `;
}
