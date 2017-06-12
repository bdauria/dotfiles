autocmd FileType typescript JsPreTmpl markdown
autocmd FileType typescript syn clear foldBraces 

let g:tsuquyomi_disable_quickfix = 1
let g:tsuquyomi_single_quote_import = 1
let g:tsuquyomi_shortest_import_path = 1

"let g:syntastic_typescript_checkers = ['tslint', 'tsuquyomi'] 
"
let g:neocomplete#force_omni_input_patterns.typescript = '[^. *\t]\.\w*\|\h\w*::'

map <leader>r :TsuReferences<CR>
map <leader>d :TsuDefinition<CR>
map <leader>z :TsuRenameSymbol<CR>
map <leader>o :TsuImport<CR>
