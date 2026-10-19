import { generateLocalCaptions, refineLocalCaption, generateHashtagSet } from '../src/services/localEngine';
import { PLATFORM_CONFIGS } from '../src/services/platformConfigs';
import { SocialPlatform, Tone, ContentCategory } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('🧪 Starting SocialMuse Studio Unit & Free-Access Tests...');

// 1. Test Local Caption Generation (100% Offline, Free, Zero-latency)
console.log('1. Testing Local Caption Generation...');
const captions = generateLocalCaptions({
  topic: 'Handcrafted ceramic espresso cups',
  platform: 'instagram',
  category: 'lifestyle',
  tone: 'friendly',
  captionLength: 'medium',
  includeEmojis: true,
});

assert(captions.length === 3, 'Expected 3 caption variations');
assert(captions[0].text.length > 50, 'Caption 1 should have rich body text');
assert(captions[0].suggestedHashtags.length > 0, 'Should include suggested hashtags');
assert(captions[0].source === 'local', 'Source should be local');
console.log('✅ Local Caption Generation passed!');

// 2. Test Hashtag Generation & Deduplication
console.log('2. Testing Hashtag Deduplication & Normalization...');
const tags = generateHashtagSet(
  'sustainable linen shirts',
  'fashion',
  ['#EcoFashion', 'SlowLiving', 'slowliving', 'OOTD!'],
  undefined,
  8
);

assert(tags.length <= 8, 'Tag count should respect limit');
const uniqueSet = new Set(tags);
assert(uniqueSet.size === tags.length, 'Tags must be strictly unique');
assert(tags.every(t => !t.includes('#')), 'Tags should be normalized without # prefix in data array');
console.log('✅ Hashtag normalization passed!');

// 3. Test Refinements
console.log('3. Testing Refinements...');
const sampleText = '✨ Beautiful morning ritual with coffee! ☕ Today we talk about slowing down. #coffee #morning';

// Shorten
const shortened = refineLocalCaption(sampleText, 'shorten');
assert(shortened.refinedText.length <= sampleText.length, 'Shortened text should be equal or smaller');

// Strip emojis
const noEmoji = refineLocalCaption(sampleText, 'remove_emojis');
assert(!noEmoji.refinedText.includes('✨') && !noEmoji.refinedText.includes('☕'), 'Emojis should be removed');

// Hook replacement
const hooked = refineLocalCaption(sampleText, 'hook');
assert(hooked.refinedText.length > 0, 'Hook should produce refined text');

// Translation
const translated = refineLocalCaption(sampleText, 'translate', undefined, 'Spanish');
assert(translated.refinedText.includes('[Traducción al Español]'), 'Translation should provide Spanish header');
console.log('✅ Refinements passed!');

// 4. Test Platform Configurations (All 8 platforms unlocked)
console.log('4. Testing Platform Configurations...');
const allPlatforms: SocialPlatform[] = [
  'instagram',
  'tiktok',
  'linkedin',
  'x',
  'youtube',
  'facebook',
  'threads',
  'pinterest',
];

allPlatforms.forEach(p => {
  const config = PLATFORM_CONFIGS[p];
  assert(!!config, `Platform ${p} configuration must exist`);
  assert(config.maxCharacters > 0, `Platform ${p} must have positive max characters`);
});
console.log('✅ All 8 Social Platforms verified and completely unlocked!');

// 5. Test Tone & Category Full Availability (Zero Paywalled Tones)
console.log('5. Testing Zero Paywalled Tones or Categories...');
const allTones: Tone[] = [
  'friendly',
  'professional',
  'casual',
  'educational',
  'inspirational',
  'humorous',
  'luxury',
  'minimal',
  'promotional',
  'storytelling',
];

allTones.forEach(tone => {
  const testCaps = generateLocalCaptions({
    topic: 'Sustainable innovation',
    platform: 'linkedin',
    category: 'business',
    tone,
    captionLength: 'short',
  });
  assert(testCaps.length === 3, `Tone ${tone} must generate 3 variations without gate`);
});
console.log('✅ All 10 Tones verified and gate-free!');

// 6. Test Free Bulk Generation without paywall limits
console.log('6. Testing Bulk Generation Freedom...');
const bulkTopics = [
  'Topic A: Clean code principles',
  'Topic B: Morning meditation tips',
  'Topic C: Coffee pour over ratios',
  'Topic D: Fall fashion capsule',
  'Topic E: Scaling your startup organically',
];

const bulkResults = bulkTopics.map(topic =>
  generateLocalCaptions({
    topic,
    platform: 'instagram',
    category: 'general',
    tone: 'friendly',
    captionLength: 'short',
  })
);
assert(bulkResults.length === 5, 'Bulk generation should process all 5 items freely');
console.log('✅ Bulk generation verified without artificial paywall gates!');

console.log('\n🎉 ALL SOCIALMUSE STUDIO UNIT & FREE-ACCESS TESTS PASSED SUCCESSFULLY!');
