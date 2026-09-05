import { CVTemplateData } from './types';

export function renderSimpleTemplate(data: CVTemplateData): string {
  const { profile, education, experience, skills, projects, certifications } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${profile.fullName || 'Curriculum Vitae'}</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      margin: 0;
      background: #ffffff;
    }
    .name { font-size: 28px; font-weight: 700; color: #0f172a; }
    .title { font-size: 15px; color: #64748b; font-weight: 500; margin-bottom: 6px; }
    .contact { font-size: 12px; color: #475569; margin-bottom: 24px; }
    .section { margin-bottom: 22px; }
    .section-title { font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #0284c7; margin-bottom: 12px; }
    .item { margin-bottom: 14px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; }
    .item-sub { font-size: 12px; color: #64748b; }
    .description { font-size: 12px; color: #334155; margin-top: 4px; }
    .bullets { margin: 6px 0 0 16px; padding: 0; font-size: 12px; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; }
    .skill-tag { background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 20px; }
  </style>
</head>
<body>
  <div class="name">${profile.fullName || 'Your Name'}</div>
  ${profile.professionalTitle ? `<div class="title">${profile.professionalTitle}</div>` : ''}
  <div class="contact">
    ${profile.email || ''} ${profile.phone ? `• ${profile.phone}` : ''} ${profile.location ? `• ${profile.location}` : ''} ${profile.linkedinUrl ? `• ${profile.linkedinUrl}` : ''}
  </div>

  ${profile.professionalSummary ? `<div class="section"><div class="section-title">About</div><div class="description">${profile.professionalSummary}</div></div>` : ''}

  ${experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${experience.map(e => `
      <div class="item">
        <div class="item-header"><span>${e.jobTitle} — ${e.company}</span><span>${e.startDate || ''} ${e.isCurrent ? 'Present' : (e.endDate || '')}</span></div>
        ${e.description ? `<div class="description">${e.description}</div>` : ''}
        ${e.bulletPoints && e.bulletPoints.length > 0 ? `<ul class="bullets">${e.bulletPoints.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map(e => `
      <div class="item">
        <div class="item-header"><span>${e.degree} ${e.fieldOfStudy ? `in ${e.fieldOfStudy}` : ''}</span><span>${e.startDate || ''} – ${e.endDate || ''}</span></div>
        <div class="item-sub">${e.institution}</div>
      </div>
    `).join('')}
  </div>` : ''}

  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-list">${skills.map(s => `<div class="skill-tag">${s.skillName}</div>`).join('')}</div>
  </div>` : ''}

  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(p => `
      <div class="item">
        <div class="item-header"><span>${p.projectName}</span></div>
        ${p.description ? `<div class="description">${p.description}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}
</body>
</html>
  `;
}
