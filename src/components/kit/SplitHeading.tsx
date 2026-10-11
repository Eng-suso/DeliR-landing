type SplitHeadingProps = {
  lead: string;
  rest?: string;
  as?: 'h1' | 'h2' | 'h3';
  tone?: 'light' | 'dark';
  id?: string;
  className?: string;
};

// Two-tone heading: the lead carries the claim, the rest is visually quieter but still AA.
export default function SplitHeading({ lead, rest, as: Tag = 'h2', tone = 'light', id, className = '' }: SplitHeadingProps) {
  const strong = tone === 'dark' ? 'text-white' : 'text-ink';
  const quiet = tone === 'dark' ? 'text-haze' : 'text-muted';
  return (
    <Tag id={id} className={`font-grotesk font-medium tracking-[-0.025em] ${strong} ${className}`}>
      {lead}
      {rest ? <span className={quiet}> {rest}</span> : null}
    </Tag>
  );
}
