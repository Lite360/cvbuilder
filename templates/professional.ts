import {CVTemplateData} from './types';

export function renderProfessionalTemplate(data : CVTemplateData): string {
    const {
        profile,
        education,
        experience,
        skills,
        projects,
        certifications
    } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${
        profile.fullName || 'Curriculum Vitae'
    }</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: Inter, Roboto, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; background: #fff; }
    .header-bar { background: #1e3a8a; color: #ffffff; padding: 25px; margin-bottom: 20px; border-radius: 4px; }
    .name { font-size: 26px; font-weight: 700; }
    .title { font-size: 15px; color: #93c5fd; font-weight: 500; }
    .contact { font-size: 12px; margin-top: 10px; color: #e0f2fe; display: flex; flex-wrap: wrap; gap: 15px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 12px; }
    .item { margin-bottom: 14px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; color: #0f172a; }
    .item-sub { font-size: 12px; color: #2563eb; font-weight: 500; }
    .description { font-size: 12px; color: #334155; margin-top: 4px; }
    .skills-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; }
    .skill-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 6px 12px; border-radius: 4px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="name">${
        profile.fullName || 'Your Name'
    }</div>
    ${
        profile.professionalTitle ? `<div class="title">${
            profile.professionalTitle
        }</div>` : ''
    }
    <div class="contact">
      ${
        profile.email ? `<div>Email: ${
            profile.email
        }</div>` : ''
    }
      ${
        profile.phone ? `<div>Phone: ${
            profile.phone
        }</div>` : ''
    }
      ${
        profile.location ? `<div>Location: ${
            profile.location
        }</div>` : ''
    }
      ${
        profile.linkedinUrl ? `<div>LinkedIn: ${
            profile.linkedinUrl
        }</div>` : ''
    }
    </div>
  </div>

  ${
        profile.professionalSummary ? `<div class="section"><div class="section-title">Summary</div><div class="description">${
            profile.professionalSummary
        }</div></div>` : ''
    }

  ${
        experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Professional Experience</div>
    ${
            experience.map(
                e => `
      <div class="item">
        <div class="item-header"><span>${
                    e.jobTitle
                }</span><span>${
                    e.startDate || ''
                } – ${
                    e.isCurrent ? 'Present' : (e.endDate || '')
                }</span></div>
        <div class="item-sub">${
                    e.company
                } ${
                    e.location ? `(${
                        e.location
                    })` : ''
                }</div>
        ${
                    e.description ? `<div class="description">${
                        e.description
                    }</div>` : ''
                }
        ${
                    e.bulletPoints && e.bulletPoints.length > 0 ? `<ul style="font-size:12px; margin-top:4px;">${
                        e.bulletPoints.map(b => `<li>${b}</li>`).join('')
                    }</ul>` : ''
                }
      </div>
    `
            ).join('')
        }
  </div>` : ''
    }

  ${
        education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education & Credentials</div>
    ${
            education.map(
                e => `
      <div class="item">
        <div class="item-header"><span>${
                    e.degree
                } ${
                    e.fieldOfStudy ? `in ${
                        e.fieldOfStudy
                    }` : ''
                }</span><span>${
                    e.startDate || ''
                } – ${
                    e.endDate || ''
                }</span></div>
        <div class="item-sub">${
                    e.institution
                }</div>
      </div>
    `
            ).join('')
        }
  </div>` : ''
    }

  ${
        skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Core Competencies</div>
    <div class="skills-container">${
            skills.map(s => `<div class="skill-box"><span><strong>${
                s.skillName
            }</strong></span><span>${
                s.proficiencyLevel
            }</span></div>`).join('')
        }</div>
  </div>` : ''
    }
</body>
</html>
  `;
}
