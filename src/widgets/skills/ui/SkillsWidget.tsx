import { Accordion, AccordionItem } from '@/shared/ui/accordion/accordion';
import { Progress } from '@/shared/ui/progress/progress';
import { Typography } from '@/shared/ui/typography/typography';

import styles from './skills.module.scss';

interface Skill {
  name: string;
  level: number;
  description: string;
}

const FRONTEND_SKILLS: Skill[] = [
  {
    name: 'React & modern SPA architecture',
    level: 95,
    description: 'Hooks, Suspense, code-splitting, performance patterns',
  },
  {
    name: 'TypeScript',
    level: 92,
    description: 'Strong typing, generics, DX-focused API design',
  },
  {
    name: 'Animations & interactive UI',
    level: 90,
    description: 'Framer Motion, custom canvas/SVG effects, microinteractions',
  },
  {
    name: 'Accessibility (a11y)',
    level: 85,
    description: 'Landmarks, keyboard UX, ARIA, semantics',
  },
  {
    name: 'Performance & data-intensive UI',
    level: 84,
    description: 'Virtualization, measuring, profiling, optimization',
  },
];

const BACKEND_DEVOPS_SKILLS: Skill[] = [
  {
    name: 'Node.js ecosystem',
    level: 80,
    description: 'API design, tooling, bundlers, build pipelines',
  },
  {
    name: 'DevOps & tooling',
    level: 72,
    description: 'CI/CD, performance tooling, monitoring, DX automation',
  },
];

export const SkillsWidget = () => {
  const headingId = 'skills-heading';

  return (
    <section id="skills" className={styles.section} aria-labelledby={headingId}>
      <div className={styles.header}>
        <Typography id={headingId} variant="h2" size="2xl" weight="bold" className={styles.title}>
          Skills & technologies
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          Technologies ordered by how often I rely on them to ship reliable, interactive experiences.
        </Typography>
      </div>

      <div className={styles.grid}>
        <Accordion>
          <AccordionItem title="Frontend" defaultOpen>
            <dl className={styles.list}>
              {FRONTEND_SKILLS.map((skill) => (
                <div key={skill.name} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <dt>
                      <Typography
                        as="span"
                        variant="body"
                        weight="medium"
                        className={styles.itemName}
                      >
                        {skill.name}
                      </Typography>
                    </dt>
                    <dd>
                      <Typography
                        as="span"
                        variant="caption"
                        color="accent"
                        className={styles.itemLevel}
                      >
                        {skill.level}%
                      </Typography>
                    </dd>
                  </div>
                  <div className={styles.bar}>
                    <Progress value={skill.level} max={100} label={`${skill.name} proficiency`} />
                  </div>
                  <Typography variant="caption">{skill.description}</Typography>
                </div>
              ))}
            </dl>
          </AccordionItem>
          <AccordionItem title="Backend & DevOps">
            <dl className={styles.list}>
              {BACKEND_DEVOPS_SKILLS.map((skill) => (
                <div key={skill.name} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <dt>
                      <Typography
                        as="span"
                        variant="body"
                        weight="medium"
                        className={styles.itemName}
                      >
                        {skill.name}
                      </Typography>
                    </dt>
                    <dd>
                      <Typography
                        as="span"
                        variant="caption"
                        color="accent"
                        className={styles.itemLevel}
                      >
                        {skill.level}%
                      </Typography>
                    </dd>
                  </div>
                  <div className={styles.bar}>
                    <Progress value={skill.level} max={100} label={`${skill.name} proficiency`} />
                  </div>
                  <Typography variant="caption">{skill.description}</Typography>
                </div>
              ))}
            </dl>
          </AccordionItem>
        </Accordion>

        <div className={styles.categories}>
          <div>
            <div className={styles.categoriesTitle}>Frontend stack</div>
            <p>
              <span className={styles.categoryTag}>React</span>{' '}
              <span className={styles.categoryTag}>TypeScript</span>{' '}
              <span className={styles.categoryTag}>Vite</span>{' '}
              <span className={styles.categoryTag}>CSS Modules</span>
            </p>
          </div>
          <div>
            <div className={styles.categoriesTitle}>What I focus on</div>
            <p>
              <span className={styles.categoryTag}>Interactive UI</span>{' '}
              <span className={styles.categoryTag}>Animations</span>{' '}
              <span className={styles.categoryTag}>Performance</span>{' '}
              <span className={styles.categoryTag}>Accessibility</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

