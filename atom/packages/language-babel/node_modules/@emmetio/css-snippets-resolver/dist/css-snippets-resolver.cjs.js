'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const DASH = 45; // -

/**
 * Calculates fuzzy match score of how close `abbr` matches given `string`.
 * @param  {String} abbr        Abbreviation to score
 * @param  {String} string      String to match
 * @param  {Number} [fuzziness] Fuzzy factor
 * @return {Number}             Match score
 */
var stringScore = function(abbr, string) {
    abbr = abbr.toLowerCase();
    string = string.toLowerCase();
    
    if (abbr === string) {
        return 1;
    }

    // a string MUST start with the same character as abbreviation
    if (!string || abbr.charCodeAt(0) !== string.charCodeAt(0)) {
        return 0;
    }

    const abbrLength = abbr.length;
    const stringLength = string.length;
    let i = 1, j = 1, score = stringLength;
    let ch1, ch2, found, acronym;

    while (i < abbrLength) {
        ch1 = abbr.charCodeAt(i);
        found = false;
        acronym = false;

        while (j < stringLength) {
            ch2 = string.charCodeAt(j);

            if (ch1 === ch2) {
                found = true;
                score += (stringLength - j) * (acronym ? 2 : 1);
                break;
            }

            // add acronym bonus for exactly next match after unmatched `-`
            acronym = ch2 === DASH;
            j++;
        }

        if (!found) {
            break;
        }

        i++;
    }

    return score && score * (i / abbrLength) / sum(stringLength);
};

/**
 * Calculates sum of first `n` natural numbers, e.g. 1+2+3+...n
 * @param  {Number} n
 * @return {Number}
 */
function sum(n) {
    return n * (n + 1) / 2;
}

const reProperty = /^([a-z\-]+)(?:\s*:\s*([^\n\r]+))?$/;
const DASH$1 = 45; // -

/**
 * Creates a special structure for resolving CSS properties from plain CSS
 * snippets.
 * Almost all CSS snippets are aliases for real CSS properties with available
 * value variants, optionally separated by `|`. Most values are keywords that
 * can be fuzzy-resolved as well. Some CSS properties are shorthands for other,
 * more specific properties, like `border` and `border-style`. For such cases
 * keywords from more specific properties should be available in shorthands too.
 * @param {Snippet[]} snippets
 * @return {CSSSnippet[]}
 */
var cssSnippets = function(snippets) {
    return nest( snippets.map(snippet => new CSSSnippet(snippet.key, snippet.value)) );
};

class CSSSnippet {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.property = null;

        // detect if given snippet is a property
        const m = value && value.match(reProperty);
        if (m) {
            this.property = m[1];
            this.value = m[2];
        }

        this.dependencies = [];
    }

    addDependency(dep) {
        this.dependencies.push(dep);
    }

    get defaulValue() {
        return this.value != null ? splitValue(this.value)[0] : null;
    }

    /**
     * Returns list of unique keywords for current CSS snippet and its dependencies
     * @return {String[]}
     */
    keywords() {
        const stack = [];
        const keywords = new Set();
        let i = 0, item, candidates;

        if (this.property) {
            // scan valid CSS-properties only
            stack.push(this);
        }

        while (i < stack.length) {
            // NB Keep items in stack instead of push/pop to avoid possible
            // circular references
            item = stack[i++];

            if (item.value) {
                candidates = splitValue(item.value).filter(isKeyword$1);

                // extract possible keywords from snippet value
                for (let j = 0; j < candidates.length; j++) {
                    keywords.add(candidates[j].trim());
                }

                // add dependencies into scan stack
                for (let j = 0, deps = item.dependencies; j < deps.length; j++) {
                    if (stack.indexOf(deps[j]) === -1) {
                        stack.push(deps[j]);
                    }
                }
            }
        }

        return Array.from(keywords);
    }
}

/**
 * Nests more specific CSS properties into shorthand ones, e.g.
 * background-position-x -> background-position -> background
 * @param  {CSSSnippet[]} snippets
 * @return {CSSSnippet[]}
 */
function nest(snippets) {
    snippets = snippets.sort(snippetsSort);
    const stack = [];

    // For sorted list of CSS properties, create dependency graph where each
    // shorthand property contains its more specific one, e.g.
    // backgound -> background-position -> background-position-x
    for (let i = 0, cur, prev; i < snippets.length; i++) {
        cur = snippets[i];

        if (!cur.property) {
            // not a CSS property, skip it
            continue;
        }

        // Check if current property belongs to one from parent stack.
        // Since `snippets` array is sorted, items are perfectly aligned
        // from shorthands to more specific variants
        while (stack.length) {
            prev = stack[stack.length - 1];

            if (cur.property.indexOf(prev.property) === 0
                && cur.property.charCodeAt(prev.property.length) === DASH$1) {
                prev.addDependency(cur);
                stack.push(cur);
                break;
            }

            stack.pop();
        }

        if (!stack.length) {
            stack.push(cur);
        }
    }

    return snippets;
}

/**
 * A sorting function for array of snippets
 * @param  {CSSSnippet} a
 * @param  {CSSSnippet} b
 * @return {Number}
 */
function snippetsSort(a, b) {
    if (a.key === b.key) {
        return 0;
    }

    return a.key < b.key ? -1 : 1;
}

/**
 * Check if given string is a keyword candidate
 * @param  {String}  str
 * @return {Boolean}
 */
function isKeyword$1(str) {
    return /^\s*[\w\-]+/.test(str);
}

function splitValue(value) {
    return String(value).split('|');
}

const globalKeywords = ['auto', 'inherit', 'unset'];
const unitlessProperties = [
    'z-index', 'line-height', 'opacity', 'font-weight', 'zoom',
    'flex', 'flex-grow', 'flex-shrink'
];

const defaultOptions = {
	intUnit: 'px',
	floatUnit: 'em',
	unitAliases: {
		e :'em',
		p: '%',
		x: 'ex',
		r: 'rem'
	},
	fuzzySearchMinScore: 0
};

/**
 * For every node in given `tree`, finds matching snippet from `registry` and
 * updates node with snippet data.
 *
 * This resolver uses fuzzy matching for searching matched snippets and their
 * keyword values.
 */

var index = function(tree, registry, options) {
	const snippets = convertToCSSSnippets(registry);
	options = {
		intUnit: (options && options.intUnit) || defaultOptions.intUnit,
		floatUnit: (options && options.floatUnit) || defaultOptions.floatUnit,
		unitAliases: Object.assign({}, defaultOptions.unitAliases, options && options.unitAliases),
		fuzzySearchMinScore: (options && options.fuzzySearchMinScore) || defaultOptions.fuzzySearchMinScore
	};
	tree.walk(node => resolveNode(node, snippets, options));
	return tree;
};

function convertToCSSSnippets(registry) {
    return cssSnippets(registry.all({type: 'string'}))
}

/**
 * Resolves given node: finds matched CSS snippets using fuzzy match and resolves
 * keyword aliases from node value
 * @param  {Node} node
 * @param  {CSSSnippet[]} snippets
 * @param  {Object} options
 * @return {Node}
 */
function resolveNode(node, snippets, options) {
	const snippet = findBestMatch(node.name, snippets, 'key', options.fuzzySearchMinScore);

	if (!snippet) {
		// Edge case: `!important` snippet
		return node.name === '!' ? setNodeAsText(node, '!important') : node;
	}

	return snippet.property
		? resolveAsProperty(node, snippet, options)
		: resolveAsSnippet(node, snippet);
}

/**
 * Resolves given parsed abbreviation node as CSS propery
 * @param {Node} node
 * @param {CSSSnippet} snippet
 * @param  {Object} formatOptions
 * @return {Node}
 */
function resolveAsProperty(node, snippet, formatOptions) {
    const abbr = node.name;
	node.name = snippet.property;

	if (node.value && typeof node.value === 'object') {
		// resolve keyword shortcuts
		const keywords = snippet.keywords();

		if (!node.value.size) {
			// no value defined, try to resolve unmatched part as a keyword alias
			let kw = findBestMatch(getUnmatchedPart(abbr, snippet.key), keywords);

            if (!kw) {
                // no matching value, try to get default one
                kw = snippet.defaulValue;
                if (kw && kw.indexOf('${') === -1) {
                    // Quick and dirty test for existing field. If not, wrap
                    // default value in a field
                    kw = `\${1:${kw}}`;
                }
            }

			if (kw) {
				node.value.add(kw);
			}
		} else {
			// replace keyword aliases in current node value
			for (let i = 0, token; i < node.value.value.length; i++) {
				token = node.value.value[i];

				if (token === '!') {
					token = `${!i ? '${1} ' : ''}!important`;
				} else if (isKeyword(token)) {
					token = findBestMatch(token.value, keywords)
						|| findBestMatch(token.value, globalKeywords)
						|| token;
				} else if (isNumericValue(token)) {
                    token = resolveNumericValue(node.name, token, formatOptions);
                }

                node.value.value[i] = token;
			}
		}
	}

	return node;
}

/**
 * Resolves given parsed abbreviation node as a snippet: a plain code chunk
 * @param {Node} node
 * @param {CSSSnippet} snippet
 * @return {Node}
 */
function resolveAsSnippet(node, snippet) {
	return setNodeAsText(node, snippet.value);
}

/**
 * Sets given parsed abbreviation node as a text snippet
 * @param {Node} node
 * @param {String} text
 * @return {Node}
 */
function setNodeAsText(node, text) {
	node.name = null;
	node.value = text;
	return node;
}

/**
 * Finds best matching item from `items` array
 * @param {String} abbr  Abbreviation to match
 * @param {Array}  items List of items for match
 * @param {String} [key] If `items` is a list of objects, use `key` as object
 * property to test against
 * @param {Number} fuzzySearchMinScore The minimum score the best matched item should have to be a valid match.
 * @return {*}
 */
function findBestMatch(abbr, items, key, fuzzySearchMinScore) {
	if (!abbr) {
		return null;
	}

	let matchedItem = null;
	let maxScore = 0;
	fuzzySearchMinScore = fuzzySearchMinScore || 0;

	for (let i = 0, item; i < items.length; i++) {
		item = items[i];
		const score = stringScore(abbr, getScoringPart(item, key));

		if (score === 1) {
			// direct hit, no need to look further
			return item;
		}

		if (score && score >= maxScore) {
			maxScore = score;
			matchedItem = item;
		}
	}

	return maxScore >= fuzzySearchMinScore ? matchedItem : null;
}

function getScoringPart(item, key) {
    const value = item && typeof item === 'object' ? item[key] : item;
    const m = (value || '').match(/^[\w-@]+/);
    return m ? m[0] : value;
}

/**
 * Returns a part of `abbr` that wasn’t directly matched agains `string`.
 * For example, if abbreviation `poas` is matched against `position`, the unmatched part will be `as`
 * since `a` wasn’t found in string stream
 * @param {String} abbr
 * @param {String} string
 * @return {String}
 */
function getUnmatchedPart(abbr, string) {
	for (let i = 0, lastPos = 0; i < abbr.length; i++) {
		lastPos = string.indexOf(abbr[i], lastPos);
		if (lastPos === -1) {
			return abbr.slice(i);
		}
        lastPos++;
	}

	return '';
}

/**
 * Check if given CSS value token is a keyword
 * @param {*} token
 * @return {Boolean}
 */
function isKeyword(token) {
	return tokenTypeOf(token, 'keyword');
}

/**
 * Check if given CSS value token is a numeric value
 * @param  {*}  token
 * @return {Boolean}
 */
function isNumericValue(token) {
    return tokenTypeOf(token, 'numeric');
}

function tokenTypeOf(token, type) {
	return token && typeof token === 'object' && token.type === type;
}

/**
 * Resolves numeric value for given CSS property
 * @param  {String} property    CSS property name
 * @param  {NumericValue} token CSS numeric value token
 * @param  {Object} formatOptions Formatting options for units
 * @return {NumericValue}
 */
function resolveNumericValue(property, token, formatOptions) {
    if (token.unit) {
        token.unit = formatOptions.unitAliases[token.unit] || token.unit;
    } else if (token.value !== 0 && unitlessProperties.indexOf(property) === -1) {
        // use `px` for integers, `em` for floats
        // NB: num|0 is a quick alternative to Math.round(0)
        token.unit = token.value === (token.value|0) ? formatOptions.intUnit : formatOptions.floatUnit;
    }

    return token;
}

exports['default'] = index;
exports.convertToCSSSnippets = convertToCSSSnippets;
exports.stringScore = stringScore;
exports.cssSnippets = cssSnippets;
