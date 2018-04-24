call plug#begin('~/.vim/plugged')
Plug 'hzchirs/vim-material'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'autozimu/LanguageClient-neovim', {
    \ 'branch': 'next',
    \ 'do': 'bash install.sh',
    \ }
Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
Plug 'w0rp/ale'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'janko-m/vim-test'
Plug 'terryma/vim-expand-region'
Plug 'sbdchd/neoformat'
Plug 'prettier/vim-prettier', {
  \ 'do': 'yarn install',
  \ 'for': ['javascript', 'typescript', 'css', 'less', 'scss', 'json', 'graphql', 'markdown', 'vue'] }
call plug#end()

colorscheme vim-material
set clipboard=unnamedplus
let base16colorspace=256
set termguicolors
set relativenumber
set colorcolumn=80
highlight ColorColumn guibg=#4f525b
let g:airline_theme='material'

let mapleader = "\<Space>"

" {W} -> [É]
" ——————————
noremap é w
noremap É W
onoremap aé aw
onoremap aÉ aW
onoremap ié iw
onoremap iÉ iW
noremap w <C-w>
noremap W <C-w><C-w>

" {cr} = « gauche / droite »
noremap c h
noremap r l
" {ts} = « haut / bas »
noremap t j
noremap s k
" {CR} = « haut / bas de l'écran »
noremap C H
noremap R L
" {TS} = « joindre / aide »
noremap T J
noremap S K
" Corollaire : repli suivant / précédent
noremap zs zj
noremap zt zk
" {J} = « Jusqu'à »
noremap j t
noremap J T
" {L} = « Change »
noremap l c
noremap L C
" {H} = « Remplace »
noremap h r
noremap H R
" {K} = « Substitue »
noremap k s
noremap K S
" Corollaire : correction orthographique
noremap ]k ]s
noremap [k [s

" Map C-s to save the file
noremap <silent> <C-S>          :update<CR>
vnoremap <silent> <C-S>         <C-C>:update<CR>
inoremap <silent> <C-S>         <C-O>:update<CR>
map <C-p> :FZF<CR>
map <C-l> :BLines<CR>
map <C-b> :Buffers<CR>
map <C-g> :GitFiles<CR>
map <Leader>t :BTags<CR>
map <Leader>a :Ag<CR>
nmap <S-Enter> O<Esc>
nmap <CR> o<Esc>

" Smart way to move between windows
map wt <C-W>j
map ws <C-W>k
map wc <C-W>h
map wr <C-W>l

" Close the current buffer
map <leader>bd :Bclose<cr>:tabclose<cr>gT

" Close all the buffers
map <leader>ba :bufdo bd<cr>

map <leader>l :bnext<cr>
map <leader>h :bprevious<cr>

" Useful mappings for managing tabs
map <leader>tn :tabnew<cr>
map <leader>to :tabonly<cr>
map <leader>tc :tabclose<cr>
map <leader>tm :tabmove 
map <leader>c :tabnext<cr>
map <leader>r :tabprev<cr>

" vim-test mappings
nmap <silent> <leader><C-n> :TestNearest<CR> " t Ctrl+n
nmap <silent> <leader><C-f> :TestFile<CR>    " t Ctrl+f
nmap <silent> <leader><C-s> :TestSuite<CR>   " t Ctrl+s
nmap <silent> <leader><C-l> :TestLast<CR>    " t Ctrl+l
nmap <silent> <leader><C-g> :TestVisit<CR>   " t Ctrl+g

" Remap VIM 0 to first non-blank character
map 0 ^

" Move a line of text using ALT+[jk] or Command+[jk] on mac
nmap <M-t> mz:m+<cr>`z
nmap <M-s> mz:m-2<cr>`z
vmap <M-t> :m'>+<cr>`<my`>mzgv`yo`z
vmap <M-s> :m'<-2<cr>`>my`<mzgv`yo`z

" Expand region mapping
map <leader>e <Plug>(expand_region_expand)
map <leader>, <Plug>(expand_region_shrink)

map <leader>cv :e ~/.config/nvim/init.vim<CR>

let g:fzf_action = {
  \ 'ctrl-j': 'tab split',
  \ 'ctrl-x': 'split',
  \ 'ctrl-v': 'vsplit'
  \ }

let g:LanguageClient_autoStart = 1

" <leader>ld to go to definition
autocmd FileType javascript nnoremap <buffer>
  \ <leader>ld :call LanguageClient_textDocument_definition()<cr>
" <leader>lh for type info under cursor
autocmd FileType javascript nnoremap <buffer>
  \ <leader>lh :call LanguageClient_textDocument_hover()<cr>
" <leader>lr to rename variable under cursor
autocmd FileType javascript nnoremap <buffer>
  \ <leader>lr :call LanguageClient_textDocument_rename()<cr>
autocmd FileType javascript nnoremap <buffer>
  \ <leader>lf :call LanguageClient_textDocument_documentSymbol()<cr>

let g:LanguageClient_serverCommands = {
    \ 'javascript': ['javascript-typescript-stdio'],
    \ 'javascript.jsx': ['tcp://127.0.0.1:2089'],
    \ }

let g:ale_linters = {
\   'javascript': ['eslint', 'jshint'],
\}
let g:ale_fixers = {
\   'javascript': ['eslint', 'jshint'],
\}

set hidden

nnoremap <silent> K :call LanguageClient#textDocument_hover()<CR>
nnoremap <silent> gd :call LanguageClient#textDocument_definition()<CR>
nnoremap <silent> <F2> :call LanguageClient#textDocument_rename()<CR>
