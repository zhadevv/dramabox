## @zhadev/dramabox
---
<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  <img src="https://img.shields.io/badge/types-TypeScript-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/npm/v/@zhadev/dramabox" alt="npm version">
  <img src="https://img.shields.io/npm/dt/@zhadev/dramabox" alt="npm downloads">
  <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen" alt="node version">
</p>

**Unofficial Dramabox API Client for Chinese Dramas!**

### Features
- **Complete API Coverage** - Access to all Dramabox endpoints
- **Multi Platform** - Works in Node.js, Browser, and TypeScript
- **Authentication Ready** - Automatic token generation and refresh
- **Type Safe** - Full TypeScript support with interfaces
- **Performance Optimized** - Built-in caching and rate limiting
- **Customizable** - Proxy support, retry mechanism, configurable delays

### Installation
```bash
# npm
npm install @zhadev/dramabox

# yarn
yarn add @zhadev/dramabox

# pnpm
pnpm add @zhadev/dramabox
```

### Quick Start

Node.js / Typescript
```javascript
// ES Module
import DramaboxScraper from '@zhadev/dramabox';

// CommonJS
const DramaboxScraper = require('@zhadev/dramabox').default;

// Initialize
const scraper = new DramaboxScraper();
```

Browser (via CDN)
```html
<script src="https://cdn.jsdelivr.net/npm/@zhadev/dramabox/dist/javascript/browser.min.js"></script>
<script>
  const scraper = new DramaboxScraper();
  
  scraper.getLatest(1).then(result => {
    console.log(result.data.results);
  });
</script>
```

With Configuration
```javascript
import DramaboxScraper from '@zhadev/dramabox';

const scraper = new DramaboxScraper({
  language: 'in',          // Language code: 'in', 'en', etc.
  version: '470',          // API version
  timeout: 30000,          // Request timeout in ms
  maxRetries: 3,           // Max retry attempts
  cacheTTL: 300,           // Cache time-to-live in seconds
  userAgent: 'Custom/1.0', // Custom User-Agent
  requestDelay: 1000       // Delay between requests in ms
});
```

### Api Reference

- **Constructor Options**
```typescript
interface ScraperConfig {
  language?: string;        // Language code (default: 'in')
  version?: string;         // API version (default: '470')
  timeout?: number;         // Request timeout in ms (default: 30000)
  maxRetries?: number;      // Max retry attempts (default: 3)
  cacheTTL?: number;        // Cache TTL in seconds (default: 300)
  userAgent?: string;       // Custom User-Agent
  requestDelay?: number;    // Delay between requests in ms (default: 1000)
}
```

- **All Methods**
```javascript
// Token Generation
generateToken(); // returns token generation (bearer token, device id, android id, etc)

// Latest Dramas
getLatest(pageNo: number); // returns latest dramas

// VIP Dramas
getVip(); // returns vip dramas

// Drama Detail
getDramaDetail(bookId: string); // returns detail drama with recommendations

// Drama Chapters/Episodes
getChapters(bookId: string); // returns episode list

// Streaming URL
getStreamUrl(bookId: string, episode: number); // returns drama streaming url (mp4 and m3u8)

// Drama List
getDramaList(pageNo: number, pageSize: number); // returns list drama with pagination

// Categories
getCategories(pageNo: number, pageSize: number); // returns list category

// Drama by Category
getBooksByCategory(typeTwoId: number, pageNo: number, pageSize: number); // returns drama list by category id

// Recommended Dramas
getRecommendedBooks(); // returns recommended dramas

// Search Index
searchDramaIndex(); // returns search index/hot videos

// Search Drama
searchDrama(keyword: string, pageNo: number, pageSize: number); // returns search results for drama

// Search Suggestions
suggestSearch(keyword: string); // returns search suggestions

// Batch Download
batchDownload(bookId: string); // returns all episodes for batch download

// Drama Detail V2
getDramaDetailV2(bookId: string); // returns drama detail v2 with webfic API

// Advanced Search
advancedSearch(keyword?: string, filters?: any); // returns advanced search results

// Trending Dramas
getTrending(); // returns trending dramas

// Homepage Data
getHomepage(); // returns combined homepage data (latest, trending, recommended)

// Related Dramas
getRelatedDramas(bookId: string); // returns related/recommended dramas

// Episode Details
getEpisodeDetails(bookId: string, episodeIndex: number); // returns detailed episode info with streaming

// Cache Operations
clearCache(); // clears all cache
getCacheStats(); // returns cache statistics

// Configuration
getConfig(); // returns scraper configuration

// Health Check
ping(); // returns service health/status
```

### Response Format
All methods return a standardized response:
```typescript
interface ApiResponse {
  success: boolean;           // Whether the request was successful
  creator: string;           // Creator name ('zhadevv')
  data: any;                // The scraped data
  metadata: any;           // Additional metadata
  message: string | null;  // Error message if any
}
```

### Response Example
- All Response Example in [here](https://github.com/zhadevv/dramabox/tree/main/response_examples).

Token Generation:
```json
{
  "success": true,
  "creator": "zhadevv",
  "data": {
    "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnlaV2RwYzNSbGNsUjVjR1VpT2lKVVJVMVFJaXdpZFhObGNrbGtJam96T1RVeU56WTJNamw5LmdRbzBrT3pvV0lIU2lhZlJuNE5fRGZ1OTFnSkd5WDlITFk1Y3RGejdJZTg=",
    "deviceId": "77783a44-512f-4fbb-8373-c98206f31a8b",
    "androidId": "8965b2e17c3b1b9d",
    "spoffer": "156.132.210.140",
    "uuid": "395276602",
    "timestamp": 1768629581686,
    "expiry": 1768715981686
  },
  "metadata": {},
  "message": null
}
```

Latest
```json
{
  "success": true,
  "creator": "zhadevv",
  "data": {
    "page": 1,
    "total": 25,
    "results": [
      {
        "bookId": "41000122939",
        "bookName": "Istriku Tiga, Takdirku Gila (Sulih Suara) ",
        "cover": "https://image.dramaboxdb.com/cover/41000122939.jpg",
        "coverWap": "https://image.dramaboxdb.com/cover-wap/41000122939.jpg",
        "introduction": "Drama tentang seorang pria yang memiliki tiga istri...",
        "chapterCount": 120,
        "playCount": 1250000,
        "tagV3s": ["Romance", "Drama", "Family"],
        "corner": {
          "name": "HOT",
          "color": "#FF0000"
        }
      }
    ]
  },
  "metadata": {},
  "message": null
}
```

### Usage

Get Latest Dramas
```javascript
const scraper = new DramaboxScraper();

// Get first page of latest dramas
const result = await scraper.getLatest(1);
if (result.success) {
  console.log(`Found ${result.data.results.length} dramas`);
  result.data.results.forEach(drama => {
    console.log(`- ${drama.bookName} (${drama.bookId})`);
  });
}
```

Searching
```javascript
// Search for love-themed dramas
const searchResult = await scraper.searchDrama('love', 1, 10);
if (searchResult.success) {
  searchResult.data.book.forEach(drama => {
    console.log(`${drama.name} - ${drama.playCount} views`);
  });
}
```

Get Drama Detail and Episode
```javascript
const bookId = '41000122939';
const detail = await scraper.getDramaDetail(bookId);
if (detail.success) {
  const drama = detail.data.detail;
  console.log(`Title: ${drama.bookName}`);
  console.log(`Episodes: ${drama.chapterCount}`);
  console.log(`Tags: ${drama.tagV3s.join(', ')}`);
  
  // Get episodes
  const chapters = await scraper.getChapters(bookId);
  if (chapters.success) {
    chapters.data.chapters.forEach((ep, index) => {
      console.log(`${index + 1}. ${ep.chapterName}`);
    });
  }
}
```

Get Stream URL
```javascript
// Get streaming URL for episode 1
const stream = await scraper.getStreamUrl('41000122939', 1);
if (stream.success) {
  console.log('MP4:', stream.data.data.chapter.video.mp4);
  console.log('M3U8:', stream.data.data.chapter.video.m3u8);
}
```

Batch Download
```javascript
const batch = await scraper.batchDownload('41000122939');
if (batch.success) {
  console.log(`Total episodes: ${batch.data.totalEpisodes}`);
  batch.data.episodes.forEach(ep => {
    console.log(`Episode ${ep.chapterIndex}: ${ep.videoPath}`);
  });
}
```

TypeScript Example
```typescript
import DramaboxScraper, { ApiResponse, DramaItem } from '@zhadev/dramabox';

const scraper = new DramaboxScraper();

async function displayDramaInfo(bookId: string): Promise<void> {
  const detail: ApiResponse = await scraper.getDramaDetail(bookId);
  
  if (detail.success) {
    const drama = detail.data.detail;
    console.log(`Title: ${drama.bookName}`);
    console.log(`Description: ${drama.introduction}`);
    console.log(`Total Episodes: ${drama.chapterCount}`);
    console.log(`Views: ${drama.playCount}`);
    
    // Get recommendations
    if (detail.data.recommendations) {
      console.log('Recommended Dramas:');
      detail.data.recommendations.forEach((rec: DramaItem) => {
        console.log(`- ${rec.bookName}`);
      });
    }
  }
}

displayDramaInfo('41000122939');
```

Error Handling
```typescript
try {
  const result = await scraper.getDramaDetail('invalid-id');
  if (!result.success) {
    console.error('API Error:', result.message);
    // Handle specific error cases
    if (result.message.includes('not found')) {
      console.log('Drama not found');
    }
  }
} catch (error) {
  console.error('Network error:', error);
  // Handle network errors
}
```

Pagination Examples
```javascript
// Get multiple pages
const pages = [];
for (let page = 1; page <= 3; page++) {
  const result = await scraper.getLatest(page);
  if (result.success) {
    pages.push(...result.data.results);
  }
  await new Promise(resolve => setTimeout(resolve, 1000)); // Delay
}

// Search with pagination
const searchResults = [];
let currentPage = 1;
let hasMore = true;

while (hasMore) {
  const result = await scraper.searchDrama('drama', currentPage, 20);
  if (result.success) {
    searchResults.push(...result.data.book);
    hasMore = result.data.isMore;
    currentPage++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

### Caching System
The library includes a built-in caching system:
```javascript
// Get cache statistics
const stats = scraper.getCacheStats();
console.log('Cache hits:', stats.hits);
console.log('Cache misses:', stats.misses);

// Clear cache (useful for development)
scraper.clearCache();
```

### Available Languages
```javascript
// Indonesian
const scraperID = new DramaboxScraper({ language: 'in' });

// English
const scraperEN = new DramaboxScraper({ language: 'en' });

// Available:
// en, in, zh, zhHans, ko, ja, tl, th, ar, pt, fr, es
```

### Rate Limiting Best Practices
```javascript
const scraper = new DramaboxScraper({
  requestDelay: 2000, // 2 seconds between requests
  maxRetries: 3      // Retry failed requests
});

// Implement your own delay if needed
async function safeRequest() {
  await scraper.getLatest(1);
  await new Promise(resolve => setTimeout(resolve, 3000)); // Additional delay
  await scraper.searchDrama('love', 1, 10);
}
```

### Compatibility
Supported Platforms
- Node.js: 18.0.0 or higher
- Browsers: Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+
- Frameworks: React, Vue, Angular, Svelte, Next.js, Nuxt.js

Build Targets
```json
{
  "cjs": "CommonJS for Node.js",
  "esm": "ES Modules for modern bundlers",
  "types": "TypeScript definitions",
  "browser": "UMD bundle for browsers"
}
```

### Project Structure
```
@zhadev/dramabox/
├── src/
│   └── Dramabox.ts         # Main library source
├── dist/
│   ├── cjs/                # CommonJS build
│   ├── esm/                # ES Module build
│   ├── types/              # TypeScript definitions
│   └── javascript/         # Browser bundles
├── package.json
├── tsconfig.json
└── README.md
```

### Important Notes
1. Educational Purpose: This library is for educational purposes only
2. Respect ToS: Always respect the website's Terms of Service
3. Rate Limiting: Implement proper delays to avoid overloading servers
4. Caching: Cache responses to reduce repeated requests
5. Legal Use: Use responsibly and comply with applicable laws

### Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### Development Setup
```bash
# Clone repository
git clone https://github.com/zhadevv/dramabox.git
cd dramabox

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

### License
This project is licensed under the MIT License.
```
MIT License

Copyright (c) 2025 zhadevv

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Links
- NPM Package: [@zhadev/dramabox](https://www.npmjs.com/package/@zhadev/dramabox?activeTab=readme)
- GitHub Repository: [zhadevv/dramabox](https://github.com/zhadevv/dramabox/tree/main)
- Issue Tracker: [GitHub Issues](https://github.com/zhadevv/dramabox/issues)
- Change Log: [Changelogs](https://github.com/zhadevv/dramabox/blob/main/CHANGELOG.md)

### Acknowledgements
- Dramabox
- Axios
- Node Cache
- Crypto
- All contributors and users
---
Disclaimer: This library is not affiliated with, maintained, authorized, endorsed or sponsored by dramabox or any of its affiliates. Use at your own risk.
# dramabox
