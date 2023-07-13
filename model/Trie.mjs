class TrieNode {
    constructor() {
      this.children = {};
      this.isWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isWord = true;
    }
  
    searchPrefix(prefix) {
      let node = this.root;
      let results = [];
      for (let char of prefix) {
        if (!node.children[char]) {
          return results;
        }
        node = node.children[char];
      }
      this.getWords(node, prefix, results);
      return results;
    }
  
    getWords(node, prefix, results) {
      if (node.isWord) {
        results.push(prefix);
      }
      for (let char in node.children) {
        this.getWords(node.children[char], prefix + char, results);
      }
    }
  }

  export { Trie };