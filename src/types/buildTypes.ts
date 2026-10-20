export type AwarenessLevel =
  | 'Unaware'
  | 'Problem Aware'
  | 'Solution Aware'
  | 'Product Aware'
  | 'Most Aware';

export type CopyStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'NEEDS EVIDENCE'
  | 'NEEDS USER INPUT';

export type ClaimClassification =
  | 'FACT'
  | 'USER-PROVIDED FACT'
  | 'MARKETING POSITION'
  | 'HYPOTHESIS'
  | 'UNVERIFIED CLAIM'
  | 'RISKY CLAIM';

export type BuildStageId =
  | 'INPUT'
  | 'JOURNEY'
  | 'FUNNEL'
  | 'LEAD_MAGNET'
  | 'PAGES'
  | 'EMAIL'
  | 'AUTOMATION'
  | 'TRACKING'
  | 'QA'
  | 'BLUEPRINT';

export type FunnelRecommendationBadge =
  | 'BEST STARTING MODEL'
  | 'VALID ALTERNATIVE'
  | 'TEST LATER'
  | 'TOO COMPLEX NOW'
  | 'NOT RECOMMENDED';

export type BuildFinalStatus =
  | 'READY TO BUILD'
  | 'READY WITH MINOR GAPS'
  | 'TEST MINIMUM FUNNEL FIRST'
  | 'RESEARCH GAP'
  | 'MESSAGE GAP'
  | 'AUTOMATION GAP'
  | 'OVERBUILT'
  | 'NOT READY';

export type EmailPlatform =
  | 'Platform-Agnostic'
  | 'Systeme.io'
  | 'ConvertKit'
  | 'ActiveCampaign'
  | 'GoHighLevel'
  | 'MailerLite'
  | 'Beehiiv'
  | 'Custom';

export interface ProofItem {
  id: string;
  type:
    | 'Testimonial'
    | 'Screenshot'
    | 'Case Study'
    | 'Credential'
    | 'Product Review'
    | 'Statistic'
    | 'Personal Result'
    | 'External Study';
  title: string;
  content: string;
  source: string;
  verifiedByUser: boolean;
}

export interface ResearchInput {
  inputMethod: 'IMPORT' | 'PASTE' | 'MANUAL';
  projectName: string;
  market: string;
  niche: string;
  audience: string;
  primaryProblem: string;
  desiredOutcome: string;
  offerCategory: string;
  selectedOffer: string;
  offerUrl?: string;
  trafficHypothesis: string;
  primaryContentChannel: string;
  awarenessStage: AwarenessLevel;
  ctaGoal: string;
  businessModel: string;
  currentAssets: string;
  evidence: string;
  researchConfidence: number; // 0 - 100
  strategicRisks: string[];
  validationNotes: string;
  buyerIntent: string;
  audienceObjections: string[];
  contentOpportunities: string[];
  researchIntegrityStatus: string;
  personalExperienceConfirmed: boolean;
}

export interface ReadinessGap {
  field: string;
  labelAr: string;
  issueAr: string;
  severity: 'CRITICAL' | 'WARNING';
}

export interface ReadinessCheckResult {
  isReady: boolean;
  canContinueAsHypothesis: boolean;
  continuedAsHypothesis: boolean;
  confidenceMode: 'FULL_BUILD' | 'CONSERVATIVE_MVF';
  gaps: ReadinessGap[];
  priorityFixAr: string;
  readinessScore: number;
}

export interface JourneyNode {
  stepOrder: number;
  stageNameEn: string;
  stageNameAr: string;
  visitorMindset: string;
  messageFocus: string;
  recommendedAction: string;
}

export interface AwarenessStageGuide {
  level: AwarenessLevel;
  labelAr: string;
  isCurrentTarget: boolean;
  messageFocus: string;
  recommendedCta: string;
  warningNotToSay: string;
}

export interface MessageMatchLink {
  step: string;
  stepAr: string;
  promiseText: string;
  status: 'ALIGNED' | 'MESSAGE MISMATCH' | 'DRIFT WARNING';
  diagnosticNote: string;
}

export interface CustomerJourneyData {
  currentState: string;
  problemAwarenessAnalysis: string;
  triggerEvent: string;
  searchDiscoveryBehavior: string;
  contentEntryPoint: string;
  questionInMind: string;
  primaryObjection: string;
  trustGap: string;
  desiredOutcome: string;
  commitmentLevel: string;
  offerReadiness: string;
  purchaseFriction: string;
  decisionTrigger: string;
  desiredNextStep: string;
  journeySteps: JourneyNode[];
  awarenessEngine: AwarenessStageGuide[];
  messageMatchChain: MessageMatchLink[];
  overallMessageMatchStatus: 'ALIGNED' | 'MESSAGE MISMATCH';
  messageMismatchReason?: string;
}

export interface FunnelScoreDimensions {
  trafficFit: number;
  audienceAwarenessFit: number;
  trustRequirement: number;
  offerComplexity: number;
  purchaseFriction: number;
  emailOpportunity: number;
  implementationDifficulty: number;
  speedToLaunch: number;
  trackingClarity: number;
  longTermAssetValue: number;
}

export interface FunnelModelOption {
  id: string;
  nameEn: string;
  nameAr: string;
  summaryAr: string;
  badge: FunnelRecommendationBadge;
  dimensions: FunnelScoreDimensions;
  tradeoffsAr: string;
  whyFitsOrFailsAr: string;
}

export interface FunnelMapNode {
  id: string;
  order: number;
  nodeTitleAr: string;
  nodeTypeEn: string;
  purpose: string;
  visitorQuestion: string;
  mainMessage: string;
  cta: string;
  trackingEvent: string;
}

export interface MinimumViableFunnelPlan {
  minimumBuild: string[];
  optionalLater: string[];
  scaleVersion: string[];
  overbuildWarningAr: string;
}

export interface FunnelStrategyData {
  evaluatedModels: FunnelModelOption[];
  primaryFunnelId: string;
  secondaryFunnelId: string;
  whyPrimaryFitsAr: string;
  mainRiskAr: string;
  whatMustBeTrueAr: string;
  doNotBuildYetAr: string[];
  confirmedByStudent: boolean;
  funnelMapNodes: FunnelMapNode[];
  minimumViableFunnel: MinimumViableFunnelPlan;
}

export interface LeadMagnetScores {
  problemRelevance: number;
  speedToValue: number;
  specificity: number;
  desiredOutcomeFit: number;
  leadToOfferBridge: number;
  perceivedValue: number;
  easeOfConsumption: number;
  easeOfCreation: number;
  differentiation: number;
  trafficFit: number;
}

export interface LeadMagnetConcept {
  id: string;
  titleAr: string;
  formatEn: string;
  formatAr: string;
  coreIdeaAr: string;
  promiseAr: string;
  scores: LeadMagnetScores;
  highlightTag?:
    | 'Strongest Concept'
    | 'Easiest Concept'
    | 'Best Conversion Hypothesis'
    | 'Best Strategic Bridge';
  whyDifferentAr: string;
}

export interface LeadMagnetArchitectureSection {
  sectionNameAr: string;
  sectionRoleEn: string;
  detailsAr: string;
  actionableItems: string[];
}

export interface LeadMagnetBridge {
  leadMagnetProblem: string;
  insightDelivered: string;
  remainingGap: string;
  solutionCategory: string;
  offerConnection: string;
}

export interface LeadMagnetData {
  concepts: LeadMagnetConcept[];
  selectedConceptId: string;
  confirmedByStudent: boolean;
  promiseStatement: {
    specificProblem: string;
    usefulOutcome: string;
    reasonableTimeEffort: string;
    fullPromiseAr: string;
    status: CopyStatus;
  };
  contentArchitecture: {
    formatType: string;
    sections: LeadMagnetArchitectureSection[];
    ctaInsideAsset: string;
  };
  offerBridge: LeadMagnetBridge;
}

export interface PagePurposeItem {
  id: string;
  pageNameEn: string;
  pageNameAr: string;
  requiredNow: boolean;
  purpose: string;
  trafficSource: string;
  visitorAwareness: string;
  mainQuestion: string;
  primaryMessage: string;
  mainCta: string;
  secondaryCta: string;
  objectionHandled: string;
  trustElement: string;
  nextDestination: string;
  trackingEvent: string;
}

export interface HeadlineOption {
  id: string;
  angleEn: string;
  angleAr: string;
  headlineAr: string;
  clarityScore: number;
  relevanceScore: number;
  specificityScore: number;
  messageMatchScore: number;
  credibilityScore: number;
  isRecommended: boolean;
}

export interface ClaimAuditItem {
  id: string;
  sourceLocation: string;
  claimText: string;
  classification: ClaimClassification;
  warningOrFixAr: string;
  isSafe: boolean;
}

export interface LandingPageArchitecture {
  selectedHeadlineId: string;
  headlineAr: string;
  subheadlineAr: string;
  supportingCopyAr: string;
  whatYouGetBullets: string[];
  whyItMattersAr: string;
  whoItIsForAr: string[];
  whoItIsNotForAr: string[];
  credibilityPlaceholderAr: string;
  ctaButtonTextAr: string;
  privacyMicrocopyAr: string;
  objectionHandlingAr: { objection: string; response: string }[];
  faqItems: { question: string; answer: string }[];
  mobileNotesAr: string[];
  status: CopyStatus;
}

export interface ThankYouPageArchitecture {
  primaryObjectiveAr: string;
  deliveryInstructionAr: string;
  expectationSettingAr: string;
  microCommitmentAskAr: string;
  offerPreFrameAr: string;
  whitelistInstructionAr: string;
  nextStepCtaAr: string;
  status: CopyStatus;
}

export interface BridgePageArchitecture {
  isStrategicallyRequired: boolean;
  problemRecapAr: string;
  whatToLookForAr: string;
  whySolutionCategoryMattersAr: string;
  productIntroductionAr: string;
  pros: string[];
  potentialLimitations: string[];
  whoItSuitsAr: string[];
  whoItMayNotSuitAr: string[];
  ctaTextAr: string;
  affiliateDisclosureAr: string;
  status: CopyStatus;
}

export interface ReviewComparisonArchitecture {
  isIncluded: boolean;
  pageType: 'Review Page' | 'Best X Page' | 'X vs Y Page' | 'Alternatives Page';
  decisionCriteria: string[];
  featureComparisonRows: { feature: string; offerNote: string; alternativeNote: string }[];
  useCasesAr: string[];
  limitationsAr: string[];
  pricingVerificationNoteAr: string;
  affiliateDisclosureAr: string;
  ctaAr: string;
}

export interface PagesData {
  pagePurposeMap: PagePurposeItem[];
  headlineOptions: HeadlineOption[];
  landingPage: LandingPageArchitecture;
  thankYouPage: ThankYouPageArchitecture;
  bridgePage: BridgePageArchitecture;
  reviewComparisonPage: ReviewComparisonArchitecture;
  claimsAudit: ClaimAuditItem[];
}

export interface EmailBlueprintItem {
  emailNumber: number;
  sequenceTypeEn: string;
  purposeAr: string;
  subjectAngleAr: string;
  coreMessageAr: string;
  objectionHandledAr: string;
  ctaAr: string;
  behaviorTriggerAr: string;
}

export interface SubjectLineOption {
  mechanismEn: string;
  mechanismAr: string;
  subjectAr: string;
  isDeceptiveRisk: boolean;
}

export interface GeneratedEmailCopy {
  emailNumber: number;
  subjectLineAr: string;
  subjectOptions: SubjectLineOption[];
  previewTextAr: string;
  openingAr: string;
  bodyAr: string;
  ctaTextAr: string;
  psTextAr: string;
  status: CopyStatus;
}

export interface EmailSystemData {
  strategy: {
    whyUserJoined: string;
    whatTheyAlreadyKnow: string;
    whatTheyNeedToBelieve: string;
    mainObjections: string[];
    trustGap: string;
    offerReadiness: string;
    desiredBehavior: string;
    recommendedEmailCount: number;
    lengthRationaleAr: string;
  };
  journeyStepsUsed: string[];
  blueprintApprovedByStudent: boolean;
  blueprint: EmailBlueprintItem[];
  emailsCopy: GeneratedEmailCopy[];
  personalizationFieldsUsed: string[];
  emailClaimsAudit: ClaimAuditItem[];
}

export interface TagDefinition {
  tagName: string; // e.g., SOURCE | YouTube
  category: 'SOURCE' | 'LEAD' | 'ENGAGED' | 'INTENT' | 'CUSTOMER' | 'STAGE';
  purposeAr: string;
  appliedWhenAr: string;
}

export interface AutomationStepNode {
  id: string;
  order: number;
  stepType: 'TRIGGER' | 'ACTION' | 'DELAY' | 'CONDITION' | 'GOAL' | 'EXIT';
  titleAr: string;
  detailAr: string;
  yesBranchAr?: string;
  noBranchAr?: string;
  tagInvolved?: string;
}

export interface SegmentationRule {
  dimension: string;
  conditionAr: string;
  howMessagingChangesAr: string;
}

export interface AutomationSafetyCheck {
  ruleNameAr: string;
  passed: boolean;
  verificationNoteAr: string;
}

export interface AutomationData {
  selectedPlatform: EmailPlatform;
  triggers: string[];
  conditions: string[];
  actions: string[];
  delays: string[];
  exitConditions: string[];
  goals: string[];
  fallbackPaths: string[];
  workflowNodes: AutomationStepNode[];
  tags: TagDefinition[];
  segments: SegmentationRule[];
  safetyChecks: AutomationSafetyCheck[];
  platformTranslationNotesAr: string[];
}

export interface CtaMapRow {
  journeyStageAr: string;
  currentIntentAr: string;
  desiredNextActionAr: string;
  primaryCtaTextAr: string;
  ctaTypeEn: string;
  ctaFrictionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  ctaMessageAr: string;
  nextDestinationAr: string;
}

export interface TrackingEventItem {
  eventName: string; // e.g. lead_magnet_requested
  funnelStepAr: string;
  triggerConditionAr: string;
  toolDestination: string;
  isAffiliatePlatformRestricted: boolean;
  restrictionNoteAr?: string;
}

export interface FunnelMetricItem {
  metricNameEn: string;
  metricNameAr: string;
  formulaOrMeaningAr: string;
  baselineInstructionAr: string;
}

export interface TrackingAndCtaData {
  ctaMap: CtaMapRow[];
  trackingEvents: TrackingEventItem[];
  funnelMetrics: FunnelMetricItem[];
  implementationGuide: {
    ga4NotesAr: string;
    metaPixelNotesAr: string;
    posthogNotesAr: string;
    utmTemplate: string;
    subIdTemplate: string;
  };
}

export interface QaCheckItem {
  category: 'FUNNEL' | 'COPY' | 'EMAIL' | 'AUTOMATION' | 'MOBILE';
  questionAr: string;
  passed: boolean;
  findingAr: string;
  fixRecommendationAr?: string;
}

export interface BuildIntegrityScores {
  buildIntegrity: number; // 0-100
  researchAlignment: number; // 0-100
  automationConfidence: number; // 0-100
  implementationReadiness: number; // 0-100
  subDimensions: {
    journeyClarity: number;
    messageMatch: number;
    funnelSimplicity: number;
    leadMagnetFit: number;
    pageConsistency: number;
    emailContinuity: number;
    automationLogic: number;
    trackingCompleteness: number;
  };
}

export interface FunnelVersionSnapshot {
  versionId: string;
  versionLabel: string; // e.g. Funnel V1
  createdAt: string;
  whatChangedAr: string;
  whyChangedAr: string;
  hypothesisAr: string;
  expectedEffectAr: string;
  resultNoteAr: string;
  primaryFunnelNameAr: string;
  leadMagnetTitleAr: string;
  mainHeadlineAr: string;
  mainCtaAr: string;
  emailCount: number;
}

export interface ExperimentLogItem {
  id: string;
  experimentName: string;
  hypothesis: string;
  variable: string;
  control: string;
  variant: string;
  primaryMetric: string;
  result: string;
  learning: string;
}

export interface ContentEntryBrief {
  primaryContentProblem: string;
  audienceAwareness: AwarenessLevel;
  coreMessage: string;
  cta: string;
  destinationPage: string;
  entryContentTopics: string[];
}

export interface TrafficHandoffBrief {
  completedStages: string[];
  nextStage: string;
  audience: string;
  problem: string;
  offer: string;
  awareness: AwarenessLevel;
  coreMessage: string;
  contentEntryPoint: string;
  cta: string;
  landingDestination: string;
  funnelGoal: string;
  leadMagnet: string;
  trackingEvents: string[];
}

export interface QaAndBlueprintData {
  qaChecks: QaCheckItem[];
  scores: BuildIntegrityScores;
  finalStatus: BuildFinalStatus;
  statusExplanationAr: string;
  implementationOrder: string[];
  doNotBuildYet: string[];
  minimumViableBreakdown: {
    buildNow: string[];
    buildAfterValidation: string[];
    scaleInfrastructure: string[];
  };
  oneActionFirstAr: string;
  contentEntryBrief: ContentEntryBrief;
  trafficHandoff: TrafficHandoffBrief;
}

export interface LockedElementsMap {
  audience: boolean;
  funnel: boolean;
  leadMagnet: boolean;
  promise: boolean;
  headline: boolean;
  mainCta: boolean;
  emailSequence: boolean;
}

export interface AffiliateBuildProject {
  schemaVersion?: number;
  id: string;
  updatedAt: string;
  currentStage: BuildStageId;
  researchInput: ResearchInput;
  readiness: ReadinessCheckResult;
  lockedElements: LockedElementsMap;
  proofLibrary: ProofItem[];
  customerJourney: CustomerJourneyData | null;
  funnelStrategy: FunnelStrategyData | null;
  leadMagnet: LeadMagnetData | null;
  pages: PagesData | null;
  emailSystem: EmailSystemData | null;
  automation: AutomationData | null;
  trackingAndCta: TrackingAndCtaData | null;
  qaAndBlueprint: QaAndBlueprintData | null;
  versions: FunnelVersionSnapshot[];
  experiments: ExperimentLogItem[];
}
