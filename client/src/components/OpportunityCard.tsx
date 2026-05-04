import { Link } from 'react-router-dom';
import { Opportunity } from '../types';

function getLinkLabel(url: string): string {
  if (url.startsWith('mailto:')) return 'Email';
  if (/\.pdf(\?|$)/i.test(url)) return 'View PDF';
  if (/\.docx(\?|$)/i.test(url)) return 'Download Flyer';
  if (url.includes('drive.google.com')) return 'View Flyer';
  if (url.includes('docs.google.com/forms') || url.includes('google.com/forms')) return 'Sign Up';
  if (url.includes('etapestry.com') || url.includes('charityproud.org')) return 'Sign Up';
  if (url.includes('volunteerconnection.redcross.org')) return 'Apply';
  if (/\/(volunteer|become-a-volunteer|signup|sign-up|register)\b/i.test(url)) return 'Sign Up';
  return 'Learn More';
}

function firstSentences(text: string | undefined, maxChars = 160): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const match = clean.match(/^(.+?[.!?])\s/);
  if (match && match[1].length <= maxChars) return match[1];
  return clean.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

function CardBody({ opportunity }: { opportunity: Opportunity }) {
  const { title, organization, description, category, url, id } = opportunity;
  const snippet = firstSentences(description);
  const displayOrg = organization || category;

  return (
    <div className="opportunity-card">
      {displayOrg && <p className="card-org-tag">{displayOrg}</p>}
      <h3 className="card-title">{title}</h3>
      {snippet && <p className="card-description">{snippet}</p>}
      <span className="card-cta">
        {url ? `${getLinkLabel(url)} →` : id ? 'View Details →' : null}
      </span>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { id, url } = opportunity;

  if (id && !url) {
    return (
      <Link to={`/opportunities/${id}`} className="card-link">
        <CardBody opportunity={opportunity} />
      </Link>
    );
  }

  if (url) {
    return (
      <a
        href={url}
        target={url.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className="card-link"
      >
        <CardBody opportunity={opportunity} />
      </a>
    );
  }

  return <CardBody opportunity={opportunity} />;
}

export default OpportunityCard;
