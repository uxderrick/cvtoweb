import { PortfolioData } from '@/types/portfolio';

interface Props {
  data: PortfolioData;
}

export default function PortfolioTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-5xl font-light mb-4 tracking-tight">{data.name}</h1>
        <p className="text-xl text-gray-400 mb-8">{data.title}</p>
        
        {/* Contact Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          {data.contact.email && (
            <a
              href={`mailto:${data.contact.email}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {data.contact.email}
            </a>
          )}
          {data.contact.linkedin && (
            <a
              href={data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://${data.contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Summary */}
        {data.summary && (
          <section className="mb-16">
            <p className="text-gray-300 leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 tracking-tight">Experience</h2>
            <div className="space-y-12">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-4">
                    <h3 className="text-lg font-normal mb-1">{exp.role}</h3>
                    <p className="text-gray-400 mb-2">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {exp.dates}
                    {exp.location && ` — ${exp.location}`}
                  </p>
                  {exp.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-400 text-sm flex gap-3">
                          <span className="text-gray-600">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 tracking-tight">Education</h2>
            <div className="space-y-8">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-normal mb-1">{edu.institution}</h3>
                  <p className="text-gray-400">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {edu.dates}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-light mb-8 tracking-tight">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-900 text-gray-300 rounded text-sm border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-600 text-sm border-t border-gray-900">
        <p>
          Built with{' '}
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            CV to Web
          </a>
        </p>
      </footer>
    </div>
  );
}
