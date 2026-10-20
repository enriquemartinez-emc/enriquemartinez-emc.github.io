export type CaseStudy = {
  title: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
};

/**
 * Anonymized write-ups of private work: no client or employer names, no code,
 * no screenshots. The Work section renders this list when it is not empty.
 */
export const caseStudies: CaseStudy[] = [];
