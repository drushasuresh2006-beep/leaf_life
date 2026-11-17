import { CareAnswers } from '../types/leafcheck';

export interface AdviceEntry {
  title: string;
  summary: string;
  bullets: string[];
  isHealthy?: boolean;
}

// General cultural and plant-care guidance only.
// No chemical names, pesticide names, or dosages are included.
export const ADVICE_BY_KEY: Record<string, AdviceEntry> = {
  healthy: {
    title: 'Leaf appears generally healthy',
    summary: 'No clear disease pattern stood out in this screening check.',
    isHealthy: true,
    bullets: [
      'Continue checking both the upper and lower sides of new leaves once a week.',
      'Water at the soil base in the morning rather than splashing leaves late in the evening.',
      'Keep spacing between pots or plants open so air circulates comfortably.',
    ],
  },
  not_sure: {
    title: 'Unclear photo or low confidence',
    summary: 'The screening cannot identify a reliable pattern from this image.',
    bullets: [
      'Place a single leaf flat against a plain, solid background with no overlapping foliage.',
      'Step into bright, indirect daylight and avoid harsh shadows or flash glare.',
      'Hold the camera steady until the leaf veins are sharp and fill most of the frame.',
    ],
  },
  early_blight: {
    title: 'Possible early blight pattern',
    summary: 'Often shows up as dark, ringed spots on older lower leaves first.',
    bullets: [
      'Prune heavily spotted lower leaves with clean scissors and dispose of them away from compost.',
      'Water slowly near the roots instead of overhead so leaves stay dry.',
      'Add dry mulch over bare soil to reduce soil splashing onto lower foliage.',
      'Ask a local nursery or agriculture officer to confirm before starting any treatment.',
    ],
  },
  late_blight: {
    title: 'Possible late blight pattern',
    summary: 'Water-soaked dark patches can spread quickly during cool, damp weather.',
    bullets: [
      'Move potted plants under shelter away from persistent rain if possible.',
      'Remove badly affected leaves promptly and wash hands and tools before touching healthy plants.',
      'Increase spacing around plants so morning dew dries faster.',
      'Show the plant to a local agriculture extension officer promptly, as this condition spreads rapidly.',
    ],
  },
  leaf_mold: {
    title: 'Possible leaf mold pattern',
    summary: 'Common in humid, sheltered spaces with limited airflow.',
    bullets: [
      'Improve airflow around terrace pots, balconies, or polyhouses by spacing plants apart.',
      'Avoid misting foliage and shift watering to early morning.',
      'Remove older shaded leaves crowding the lower stem.',
      'Confirm with a local nursery specialist if yellowing spreads upward.',
    ],
  },
  leaf_curl: {
    title: 'Possible leaf curl stress',
    summary: 'Leaves may pucker, cup upward or downward, and grow smaller than usual.',
    bullets: [
      'Inspect the undersides of curled shoots closely for tiny sap-feeding insects.',
      'Keep the affected plant separated from healthy chillies or tomatoes while monitoring.',
      'Avoid overfeeding soft new shoots, which can attract sap-feeding pests.',
      'Consult your local agriculture officer or nursery expert to check whether insects or a virus are involved.',
    ],
  },
  bacterial_spot: {
    title: 'Possible bacterial spot pattern',
    summary: 'Small dark spots that sometimes develop pale halos or papery centers.',
    bullets: [
      'Avoid handling wet plants, as moisture helps spread spots from leaf to leaf.',
      'Remove severely affected leaves and keep fallen leaves cleared from the soil surface.',
      'Water gently at soil level and clean pruning shears after each plant.',
      'Check with a local agriculture office before choosing any management step.',
    ],
  },
  powdery_mildew: {
    title: 'Possible powdery mildew pattern',
    summary: 'Appears as dusty white or pale grey patches on upper leaf surfaces.',
    bullets: [
      'Move container plants to a spot with brighter morning sunlight and better breeze.',
      'Trim overcrowded inner stems to open the plant canopy.',
      'Remove heavily coated leaves and keep them out of home compost piles.',
      'Confirm with a local nursery expert for safe next steps suited to your crop.',
    ],
  },
  cercospora_spot: {
    title: 'Possible cercospora leaf spot',
    summary: 'Circular greyish-brown spots that often appear on mature leaves.',
    bullets: [
      'Clear away fallen spotted leaves around the base of the plant.',
      'Water at soil level early in the day so leaves dry quickly.',
      'Ensure pots or beds drain freely without standing moisture.',
      'Verify with a local agriculture officer if spotting reaches upper shoots.',
    ],
  },
  little_leaf: {
    title: 'Possible little-leaf growth change',
    summary: 'New shoots appear unusually small, narrow, and bunched together.',
    bullets: [
      'Check neighbouring plants for similar stunted, clustered new leaves.',
      'Monitor for small hopping insects around young shoots.',
      'Avoid propagating cuttings from any plant showing stunted new growth.',
      'Consult a local agriculture specialist for confirmation before removing plants.',
    ],
  },
  black_spot: {
    title: 'Possible black spot pattern',
    summary: 'Dark rounded spots with fringed edges, often followed by leaf yellowing.',
    bullets: [
      'Collect and discard fallen yellow or spotted leaves from around the rose base.',
      'Prune dense interior canes lightly to let sun and air reach the center.',
      'Keep foliage dry during watering by aiming directly at the potting mix.',
      'Speak with a local nursery grower for variety-specific care advice.',
    ],
  },
  leaf_spot: {
    title: 'Possible general leaf spot',
    summary: 'Localized brown or tan patches that may stem from moisture stress or mild infection.',
    bullets: [
      'Trim away the worst-affected leaves using clean blades.',
      'Check that excess water drains freely out of the bottom of the pot.',
      'Keep leaves dry overnight and give plants breathing room.',
      'Check with a local garden center if new leaves continue spotting.',
    ],
  },
  chlorosis: {
    title: 'Possible leaf yellowing (chlorosis)',
    summary: 'Leaves lose deep green colour while veins may remain darker green.',
    bullets: [
      'Check whether watering is too frequent or the pot saucer holds stagnant water.',
      'Review sunlight exposure and whether potting soil has become compacted.',
      'Top-dress containers gently with well-rotted compost if the mix is old.',
      'Ask a local nursery advisor to check soil pH or root health if yellowing persists.',
    ],
  },
  downy_mildew: {
    title: 'Possible downy mildew pattern',
    summary: 'Angular pale patches on top with faint greyish fuzz underneath in damp air.',
    bullets: [
      'Increase air movement around herbs or vines and avoid crowding pots together.',
      'Water only in the morning so foliage dries well before nightfall.',
      'Remove heavily affected leaves promptly without shaking them over nearby plants.',
      'Consult a local agriculture officer or nursery expert before applying any remedy.',
    ],
  },
  sooty_mold: {
    title: 'Possible sooty mold coating',
    summary: 'A dark surface film that often grows where sticky honeydew from insects collects.',
    bullets: [
      'Check leaf undersides and stems for small sap-sucking insects such as scale or aphids.',
      'Gently wipe accessible leaves with a damp soft cloth using plain water.',
      'Prune overly shaded inner twigs to improve airflow and light.',
      'Ask a local nursery specialist about managing the underlying sap-feeding insects.',
    ],
  },
  root_stress_spot: {
    title: 'Possible root or moisture stress',
    summary: 'Brown leaf margins or soft spots frequently linked to soggy or compacted potting mix.',
    bullets: [
      'Check that the container has clear drainage holes and empty any standing saucer water.',
      'Let the top 2–3 cm of soil dry out slightly before watering again.',
      'Trim browned leaf tips cleanly and move the plant to bright, indirect light.',
      'Inspect roots if leaves continue drooping; repot into airy potting mix if needed.',
    ],
  },
  bacterial_blight: {
    title: 'Possible bacterial leaf blight',
    summary: 'Dark, soft-edged patches sometimes bordered by a pale yellow rim.',
    bullets: [
      'Separate the pot from nearby foliage plants while watching new growth.',
      'Avoid misting leaves and cut away affected leaves with sanitized scissors.',
      'Keep potting soil airy and well-drained.',
      'Check with a local horticulture expert if stem rot appears.',
    ],
  },
  northern_blight: {
    title: 'Possible northern leaf blight',
    summary: 'Long, cigar-shaped greyish-green or tan lesions along the leaf blade.',
    bullets: [
      'Inspect surrounding rows to see if lower or middle leaves are most affected.',
      'Clear old crop residue from field margins between planting cycles.',
      'Avoid overhead irrigation during humid late afternoons when possible.',
      'Share photos or sample leaves with your local agriculture extension officer.',
    ],
  },
  common_rust: {
    title: 'Possible common rust pattern',
    summary: 'Small raised rusty-brown pustules scattered on upper and lower leaf surfaces.',
    bullets: [
      'Monitor young plants during cool, humid mornings when spores spread easily.',
      'Note how much of the leaf area is affected across multiple plants in the plot.',
      'Ask your local agriculture officer whether tolerant varieties are recommended next season.',
    ],
  },
  brown_spot: {
    title: 'Possible brown spot pattern',
    summary: 'Oval brown spots that can reflect nutrient imbalance or humid field conditions.',
    bullets: [
      'Check field water management and soil fertility across affected patches.',
      'Keep bunds clear of host weeds between cropping seasons.',
      'Consult your local agriculture extension officer for soil-testing and field guidance.',
    ],
  },
  leaf_blast: {
    title: 'Possible leaf blast pattern',
    summary: 'Spindle-shaped spots with grey centers and darker borders.',
    bullets: [
      'Inspect nearby hills for spreading lesions, especially on younger leaves.',
      'Avoid excess nitrogen-rich top-dressing when damp conditions persist.',
      'Contact your local agriculture officer promptly for field-level assessment.',
    ],
  },
};

export function getCareIssueHints(careAnswers: CareAnswers, isHealthy: boolean): string[] {
  const hints: string[] = [];

  if (
    careAnswers.wateringFrequency === 'daily' &&
    (careAnswers.potDrainage === 'no' || careAnswers.potDrainage === 'not_sure')
  ) {
    hints.push(
      'Daily watering combined with limited or uncertain pot drainage often keeps roots waterlogged, which can trigger yellowing and leaf spots.'
    );
  } else if (careAnswers.potDrainage === 'no') {
    hints.push(
      'Containers without drainage holes hold excess water around roots. Checking or adding drainage holes may relieve leaf stress.'
    );
  }

  if (careAnswers.wateringFrequency === 'daily' && careAnswers.sunlight === 'low') {
    hints.push(
      'In low light, potting soil dries slowly. Check whether the top 2–3 cm of soil is still wet before watering daily.'
    );
  }

  if (careAnswers.wateringFrequency === 'weekly' && careAnswers.sunlight === 'bright') {
    hints.push(
      'In bright sun, watering only once a week can leave container plants too dry between waterings, causing crispy brown edges.'
    );
  }

  if (careAnswers.sunlight === 'low') {
    hints.push(
      'Low sunlight can weaken leaf growth and keep foliage damp longer after watering. Moving the pot to brighter morning light may help.'
    );
  }

  if (careAnswers.lastFertilised === 'never' || careAnswers.lastFertilised === 'long_ago') {
    hints.push(
      'If older lower leaves are paling evenly, depleted potting nutrients could be contributing alongside or instead of disease.'
    );
  }

  if (hints.length === 0) {
    hints.push(
      isHealthy
        ? 'Your watering, sunlight, and drainage routine looks well balanced for steady growth.'
        : 'Your watering, sunlight, and drainage answers do not show an obvious care mismatch, so keep watching new leaves over the next 5–7 days.'
    );
  }

  return hints;
}
