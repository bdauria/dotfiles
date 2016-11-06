autocmd FileType typescript JsPreTmpl markdown
autocmd FileType typescript syn clear foldBraces 

let g:tsuquyomi_disable_quickfix = 1
let g:syntastic_typescript_checkers = ['tslint', 'tsuquyomi'] 

map <leader>r :TsuReferences<CR>
map <leader>d :TsuDefinition<CR>
map <leader>z :TseRenameSymbol<CR>
