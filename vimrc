set nocompatible 

filetype off   

source ~/.vimrc.bepo
source ~/.vimrc.plugin
source ~/.vimrc.map

colorscheme Monokai
syntax enable
set autoindent
set number
set relativenumber
set tabstop=2
set shiftwidth=2
set expandtab
set hidden
set wildmenu

set mouse=a

if &term =~ '256color'
  set t_ut=
endif

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
let g:syntastic_ruby_checkers = ['rubocop']
let g:syntastic_haml_checkers = ['haml_lint']
let g:tsuquyomi_disable_quickfix = 1
let g:syntastic_typescript_checkers = ['tslint', 'tsuquyomi'] 

let g:rspec_command = "Dispatch rspec {test}"
let g:cucumber_command = "Dispatch bundle exec cucumber {test}"

set backupdir=~/.vim/backup//
set directory=~/.vim/swap//
set undodir=~/.vim/undo//

" The Silver Searcher
if executable('ag')
  " Use ag over grep
  set grepprg=ag\ --nogroup\ --nocolor

  " Use ag in CtrlP for listing files. Lightning fast and respects .gitignore
  let g:ctrlp_user_command = 'ag %s -l --nocolor -g ""'

  " ag is fast enough that CtrlP doesn't need to cache
  let g:ctrlp_use_caching = 0
endif

" autowrite when switching buffers
set autowrite

autocmd BufNewFile,BufRead,BufFilePost *.hamljs set filetype=haml
autocmd FileType typescript JsPreTmpl markdown
autocmd FileType typescript syn clear foldBraces 
autocmd BufNewFile,BufRead,BufFilePost *.html set filetype=xml

runtime macros/matchit.vim

" Ignore case for searching
set ignorecase

" Open new split below instead of above
set splitbelow

" Open new vsplit on the right instead of left
set splitright

" Use airline
let g:airline#extensions#tabline#enabled = 1
let g:airline_powerline_fonts = 1
let g:airline_theme='powerlineish'
let g:airline#extensions#syntastic#enabled = 1
set laststatus=2

" Visual mark to notice long lines
set colorcolumn=80

" Use single quotes for :TsuImport
let g:tsuquyomi_single_quote_import = 1

" Use Dispatch with angular-cli.vim
let g:angular_cli_use_dispatch = 1
