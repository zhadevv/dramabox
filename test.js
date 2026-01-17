const fs = require('fs');
const path = require('path');
const DramaboxScraper = require('./src/Dramabox.ts').DramaboxScraper;

async function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function saveResponse(filename, response) {
    const dir = path.dirname(filename);
    await ensureDirectory(dir);
    const data = JSON.stringify(response, null, 2);
    fs.writeFileSync(filename, data);
    return response;
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testToken() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const token = await scraper.generateToken();
    await saveResponse('response_examples/token/token.json', {
        success: true,
        token: token.token,
        deviceId: token.deviceId,
        androidId: token.androidId,
        uuid: token.uuid,
        expiry: new Date(token.expiry).toISOString(),
        timestamp: token.timestamp
    });
    
    return token;
}

async function testLatest() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const latest1 = await scraper.getLatest(1);
    await saveResponse('response_examples/latest/page-1.json', latest1);
    await delay(1000);
    
    const latest2 = await scraper.getLatest(2);
    await saveResponse('response_examples/latest/page-2.json', latest2);
    
    return latest1;
}

async function testVip() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const vip = await scraper.getVip();
    await saveResponse('response_examples/vip/vip.json', vip);
    
    return vip;
}

async function testSearch() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const searchIndex = await scraper.searchDramaIndex();
    await saveResponse('response_examples/search/index.json', searchIndex);
    await delay(1000);
    
    const searchLove = await scraper.searchDrama('love', 1, 10);
    await saveResponse('response_examples/search/love.json', searchLove);
    await delay(1000);
    
    const searchDrama = await scraper.searchDrama('drama', 1, 10);
    await saveResponse('response_examples/search/drama.json', searchDrama);
    
    return searchIndex;
}

async function testDramaDetail(bookId) {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const detail = await scraper.getDramaDetail(bookId);
    await saveResponse('response_examples/detail/detail.json', detail);
    await delay(1000);
    
    const chapters = await scraper.getChapters(bookId);
    await saveResponse('response_examples/chapters/chapters.json', chapters);
    
    return { detail, chapters };
}

async function testStream(bookId, episode) {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const stream = await scraper.getStreamUrl(bookId, episode);
    await saveResponse('response_examples/stream/stream.json', stream);
    
    return stream;
}

async function testCategories() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const categories = await scraper.getCategories();
    await saveResponse('response_examples/categories/categories.json', categories);
    await delay(1000);
    
    if (categories.success && categories.data && categories.data.length > 0) {
        const categoryId = categories.data[0].typeTwoId;
        const books = await scraper.getBooksByCategory(categoryId, 1, 10);
        await saveResponse('response_examples/categories/books.json', books);
    }
    
    return categories;
}

async function testRecommended() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const recommended = await scraper.getRecommendedBooks();
    await saveResponse('response_examples/recommended/recommended.json', recommended);
    
    return recommended;
}

async function testDramaList() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const list = await scraper.getDramaList(1, 10);
    await saveResponse('response_examples/list/list.json', list);
    
    return list;
}

async function testSuggest() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const suggest = await scraper.suggestSearch('love');
    await saveResponse('response_examples/suggest/suggest.json', suggest);
    
    return suggest;
}

async function testBatch() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const searchIndex = await scraper.searchDramaIndex();
    if (searchIndex.success && searchIndex.data && searchIndex.data.length > 0) {
        const bookId = searchIndex.data[0].bookId;
        const batch = await scraper.batchDownload(bookId);
        await saveResponse('response_examples/batch/batch.json', batch);
        return batch;
    }
    
    return { success: false, message: 'No book ID found for batch test' };
}

async function testAdvanced() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const advanced = await scraper.advancedSearch('love', { pageNo: 1, pageSize: 10 });
    await saveResponse('response_examples/advanced/advanced.json', advanced);
    
    return advanced;
}

async function testTrending() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const trending = await scraper.getTrending();
    await saveResponse('response_examples/trending/trending.json', trending);
    
    return trending;
}

async function testHomepage() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const homepage = await scraper.getHomepage();
    await saveResponse('response_examples/homepage/homepage.json', homepage);
    
    return homepage;
}

async function testRelated(bookId) {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const related = await scraper.getRelatedDramas(bookId);
    await saveResponse('response_examples/related/related.json', related);
    
    return related;
}

async function testEpisodeDetails(bookId, episode) {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const episodeDetails = await scraper.getEpisodeDetails(bookId, episode);
    await saveResponse('response_examples/episode/episode.json', episodeDetails);
    
    return episodeDetails;
}

async function testCache() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const stats = scraper.getCacheStats();
    await saveResponse('response_examples/cache/stats.json', stats);
    
    const clear = scraper.clearCache();
    await saveResponse('response_examples/cache/clear.json', clear);
    
    return { stats, clear };
}

async function testConfig() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const config = scraper.getConfig();
    await saveResponse('response_examples/config/config.json', config);
    
    return config;
}

async function testPing() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const ping = await scraper.ping();
    await saveResponse('response_examples/ping/ping.json', ping);
    
    return ping;
}

async function testErrorCases() {
    const scraper = new DramaboxScraper({ language: 'in', timeout: 30000 });
    
    const emptySearch = await scraper.searchDrama('', 1, 10);
    await saveResponse('response_examples/errors/empty-search.json', emptySearch);
    
    const invalidDetail = await scraper.getDramaDetail('');
    await saveResponse('response_examples/errors/invalid-detail.json', invalidDetail);
    
    const invalidStream = await scraper.getStreamUrl('invalid', 0);
    await saveResponse('response_examples/errors/invalid-stream.json', invalidStream);
}

async function main() {
    await ensureDirectory('response_examples');
    
    console.log('Starting Dramabox API Test...');
    
    try {
        const token = await testToken();
        console.log('Token test completed');
        await delay(1000);
        
        const latest = await testLatest();
        console.log('Latest test completed');
        await delay(1000);
        
        const vip = await testVip();
        console.log('VIP test completed');
        await delay(1000);
        
        const search = await testSearch();
        console.log('Search test completed');
        await delay(1000);
        
        let testBookId = 41000113521;
        let testEpisode = 1;
        
        if (search.success && search.data && search.data.length > 0) {
            testBookId = search.data[0].bookId;
            
            const dramaDetail = await testDramaDetail(testBookId);
            console.log('Drama detail test completed');
            await delay(1000);
            
            if (dramaDetail.chapters.success && dramaDetail.chapters.data && 
                dramaDetail.chapters.data.chapters && dramaDetail.chapters.data.chapters.length > 0) {
                testEpisode = dramaDetail.chapters.data.chapters[0].chapterIndex || 1;
                
                const stream = await testStream(testBookId, testEpisode);
                console.log('Stream test completed');
                await delay(1000);
                
                const episodeDetails = await testEpisodeDetails(testBookId, testEpisode);
                console.log('Episode details test completed');
                await delay(1000);
                
                const related = await testRelated(testBookId);
                console.log('Related dramas test completed');
                await delay(1000);
            }
        }
        
        const categories = await testCategories();
        console.log('Categories test completed');
        await delay(1000);
        
        const recommended = await testRecommended();
        console.log('Recommended test completed');
        await delay(1000);
        
        const list = await testDramaList();
        console.log('Drama list test completed');
        await delay(1000);
        
        const suggest = await testSuggest();
        console.log('Suggest test completed');
        await delay(1000);
        
        const advanced = await testAdvanced();
        console.log('Advanced search test completed');
        await delay(1000);
        
        const trending = await testTrending();
        console.log('Trending test completed');
        await delay(1000);
        
        const homepage = await testHomepage();
        console.log('Homepage test completed');
        await delay(1000);
        
        const cache = await testCache();
        console.log('Cache test completed');
        await delay(1000);
        
        const config = await testConfig();
        console.log('Config test completed');
        await delay(1000);
        
        const ping = await testPing();
        console.log('Ping test completed');
        await delay(1000);
        
        await testErrorCases();
        console.log('Error cases test completed');
        
        console.log('\n✅ All tests completed!');
        console.log('📁 Results saved to response_examples/ directory');
        
        const stats = {
            timestamp: new Date().toISOString(),
            tests: 18,
            success: true,
            directory: 'response_examples/'
        };
        
        await saveResponse('response_examples/test-summary.json', stats);
        
    } catch (error) {
        console.error('Test failed:', error.message);
        await saveResponse('response_examples/test-error.json', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
}

if (require.main === module) {
    main();
}
