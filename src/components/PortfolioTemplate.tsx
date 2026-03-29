import { PortfolioData } from '@/types/portfolio';

interface Props {
  data: PortfolioData;
  isEditing?: boolean;
  onUpdate?: (newData: PortfolioData) => void;
}

export default function PortfolioTemplate({ data, isEditing, onUpdate }: Props) {
  const theme = data.theme || 'midnight';
  const sectionOrder = data.sectionOrder || ['experience', 'education', 'skills'];

  const themeStyles = {
    midnight: {
      bg: 'bg-black',
      text: 'text-white',
      muted: 'text-gray-400',
      border: 'border-gray-900',
      accent: 'text-blue-500',
      accentBg: 'bg-gray-900',
      card: 'bg-gray-900/50',
      label: 'text-gray-600',
    },
    snow: {
      bg: 'bg-white',
      text: 'text-slate-900',
      muted: 'text-slate-500',
      border: 'border-slate-100',
      accent: 'text-blue-600',
      accentBg: 'bg-slate-50',
      card: 'bg-slate-50/50',
      label: 'text-slate-400',
    },
    cobalt: {
      bg: 'bg-slate-950',
      text: 'text-slate-50',
      muted: 'text-slate-400',
      border: 'border-slate-800',
      accent: 'text-cyan-400',
      accentBg: 'bg-slate-900',
      card: 'bg-slate-900/50',
      label: 'text-slate-600',
    }
  }[theme];

  const handleUpdate = (newData: PortfolioData) => {
    onUpdate?.(newData);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    handleUpdate({ ...data, sectionOrder: newOrder });
  };

  const handleChange = (path: string, value: string) => {
    if (!onUpdate) return;

    const newData = { ...data };
    const parts = path.split('.');
    let current: any = newData;

    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('[')) {
      const [prop, indexPart] = lastPart.split('[');
      const index = parseInt(indexPart.replace(']', ''));
      current[prop][index] = value;
    } else {
      current[lastPart] = value;
    }
    onUpdate(newData);
  };

  const handleArrayUpdate = (path: string, index: number, value: string) => {
    if (!onUpdate) return;
    const newData = { ...data };
    const parts = path.split('.');
    let current: any = newData;
    for (let i = 0; i < parts.length; i++) {
      current = current[parts[i]];
    }
    current[index] = value;
    onUpdate(newData);
  };

  const EditableText = ({ 
    value, 
    onSave, 
    className = "", 
    element: Element = "span" 
  }: { 
    value: string, 
    onSave: (val: string) => void, 
    className?: string,
    element?: any
  }) => {
    if (!isEditing) return <Element className={className}>{value}</Element>;
    
    return (
      <Element
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: any) => onSave(e.target.innerText)}
        className={`${className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 -mx-1 hover:bg-white/5 transition-colors cursor-text`}
      >
        {value}
      </Element>
    );
  };

  const ReorderControls = ({ index }: { index: number }) => {
    if (!isEditing) return null;
    return (
      <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => moveSection(index, 'up')}
          disabled={index === 0}
          className="p-1 hover:bg-slate-800 rounded disabled:opacity-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => moveSection(index, 'down')}
          disabled={index === sectionOrder.length - 1}
          className="p-1 hover:bg-slate-800 rounded disabled:opacity-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  };

  const renderSection = (type: string, index: number) => {
    switch (type) {
      case 'experience':
        if (data.experience.length === 0 && !isEditing) return null;
        return (
          <section key="experience" className="mb-16 relative group">
            <ReorderControls index={index} />
            <h2 className={`text-sm font-bold uppercase tracking-widest ${themeStyles.label} mb-8`}>Experience</h2>
            <div className="space-y-12">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="mb-4">
                    <EditableText 
                      element="h3" 
                      value={exp.role} 
                      onSave={(v) => {
                        const newExp = [...data.experience];
                        newExp[idx].role = v;
                        handleUpdate({ ...data, experience: newExp });
                      }} 
                      className="text-lg font-medium mb-1 block"
                    />
                    <EditableText 
                      element="p" 
                      value={exp.company} 
                      onSave={(v) => {
                        const newExp = [...data.experience];
                        newExp[idx].company = v;
                        handleUpdate({ ...data, experience: newExp });
                      }} 
                      className={`${themeStyles.muted} mb-2 block`}
                    />
                  </div>
                  <div className={`flex gap-2 text-sm ${themeStyles.label} mb-4`}>
                    <EditableText 
                      value={exp.dates} 
                      onSave={(v) => {
                        const newExp = [...data.experience];
                        newExp[idx].dates = v;
                        handleUpdate({ ...data, experience: newExp });
                      }} 
                    />
                    {exp.location && (
                      <>
                        <span>—</span>
                        <EditableText 
                          value={exp.location} 
                          onSave={(v) => {
                            const newExp = [...data.experience];
                            newExp[idx].location = v;
                            handleUpdate({ ...data, experience: newExp });
                          }} 
                        />
                      </>
                    )}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className={`${themeStyles.muted} text-sm flex gap-3`}>
                          <span className={`${themeStyles.label} mt-1`}>•</span>
                          <EditableText 
                            value={bullet} 
                            onSave={(v) => {
                              const newExp = [...data.experience];
                              newExp[idx].bullets[bulletIdx] = v;
                              handleUpdate({ ...data, experience: newExp });
                            }} 
                            className="flex-1"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        if (data.education.length === 0 && !isEditing) return null;
        return (
          <section key="education" className="mb-16 relative group">
            <ReorderControls index={index} />
            <h2 className={`text-sm font-bold uppercase tracking-widest ${themeStyles.label} mb-8`}>Education</h2>
            <div className="space-y-8">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <EditableText 
                    element="h3" 
                    value={edu.institution} 
                    onSave={(v) => {
                      const newEdu = [...data.education];
                      newEdu[idx].institution = v;
                      handleUpdate({ ...data, education: newEdu });
                    }} 
                    className="text-lg font-medium mb-1 block"
                  />
                  <div className={`${themeStyles.muted} flex gap-1 flex-wrap`}>
                    <EditableText 
                      value={edu.degree} 
                      onSave={(v) => {
                        const newEdu = [...data.education];
                        newEdu[idx].degree = v;
                        handleUpdate({ ...data, education: newEdu });
                      }} 
                    />
                    {edu.field && (
                      <>
                        <span>in</span>
                        <EditableText 
                          value={edu.field} 
                          onSave={(v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].field = v;
                            handleUpdate({ ...data, education: newEdu });
                          }} 
                        />
                      </>
                    )}
                  </div>
                  <div className={`text-sm ${themeStyles.label} mt-2 flex gap-2`}>
                    <EditableText 
                      value={edu.dates} 
                      onSave={(v) => {
                        const newEdu = [...data.education];
                        newEdu[idx].dates = v;
                        handleUpdate({ ...data, education: newEdu });
                      }} 
                    />
                    {edu.location && (
                      <>
                        <span>•</span>
                        <EditableText 
                          value={edu.location} 
                          onSave={(v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].location = v;
                            handleUpdate({ ...data, education: newEdu });
                          }} 
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        if (data.skills.length === 0 && !isEditing) return null;
        return (
          <section key="skills" className="relative group">
            <ReorderControls index={index} />
            <h2 className={`text-sm font-bold uppercase tracking-widest ${themeStyles.label} mb-8`}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, idx) => (
                <EditableText
                  key={idx}
                  value={skill}
                  onSave={(v) => handleArrayUpdate('skills', idx, v)}
                  className={`px-4 py-2 ${themeStyles.accentBg} ${themeStyles.muted} rounded text-sm border ${themeStyles.border} hover:border-gray-700 transition-colors inline-block`}
                />
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} transition-colors duration-500`}>
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <EditableText 
          element="h1" 
          value={data.name} 
          onSave={(v) => handleChange('name', v)} 
          className="text-6xl font-extralight mb-6 tracking-tight block"
        />
        <EditableText 
          element="p" 
          value={data.title} 
          onSave={(v) => handleChange('title', v)} 
          className={`text-2xl ${themeStyles.muted} mb-12 block font-light`}
        />

        {/* Contact Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium">
          {data.contact.email && (
            <div className="flex items-center gap-3">
              <span className={themeStyles.label}>Email</span>
              <EditableText 
                value={data.contact.email} 
                onSave={(v) => handleChange('contact.email', v)} 
                className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors border-b ${themeStyles.border}`}
              />
            </div>
          )}
          {data.contact.linkedin && (
            <div className="flex items-center gap-3">
              <span className={themeStyles.label}>LinkedIn</span>
              <EditableText 
                value={data.contact.linkedin} 
                onSave={(v) => handleChange('contact.linkedin', v)} 
                className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors border-b ${themeStyles.border}`}
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-32">
        {/* Summary */}
        {data.summary && (
          <section className="mb-24">
            <EditableText 
              element="p" 
              value={data.summary} 
              onSave={(v) => handleChange('summary', v)} 
              className={`text-xl leading-relaxed font-light ${themeStyles.text} opacity-90`}
            />
          </section>
        )}

        <div className="space-y-24">
          {sectionOrder.map((type, index) => renderSection(type, index))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`max-w-4xl mx-auto px-6 py-16 text-center ${themeStyles.label} text-xs border-t ${themeStyles.border} mt-32`}>
        <p className="tracking-widest uppercase mb-2">Designed and Built by AI</p>
        <p>
          Generated with{' '}
          <a href="/" className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors font-bold`}>
            CV TO WEB
          </a>
        </p>
      </footer>
    </div>
  );
}

