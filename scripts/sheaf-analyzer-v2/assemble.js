const fs = require('fs'), path = require('path');
const css = fs.readFileSync(path.join(__dirname,'v1-style.css'), 'utf8').replace(/^<style>\n?/, '').replace(/<\/style>\s*$/, '');
let html = fs.readFileSync(path.join(__dirname,'page-markup.html'), 'utf8').replace('/*V1STYLE*/', css.trim());
const js = ['engine-math.js', 'engine-text.js', 'engine-topic.js', 'engine-insights.js', 'engine-sentiment.js', 'engine-rhetoric.js', 'engine-stats.js', 'engine-review.js', 'engine-argument.js', 'samples.js', 'graph2d.js', 'ui.js', 'ui-explore.js', 'ui-review.js', 'ui-upload.js', 'ui-argument.js'].map(f => '<script id="sa2-' + f.replace('.js', '') + '">\n' + fs.readFileSync(path.join(__dirname, f), 'utf8') + '\n</script>').join('\n');
html += '\n' + js + '\n';
fs.writeFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'static', 'pages', 'sheaf-analyzer.html'), html);
console.log('assembled', (html.length / 1024).toFixed(1) + ' KB');
