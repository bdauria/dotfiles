set nocompatible 
set termencoding=utf8 
set encoding=utf8
set term=xterm 
set t_Co=256 
let &t_AB="\e[48;5;%dm"
let &t_AF="\e[38;5;%dm"

source ~/.vimrc.bepo
source ~/.vimrc.plugin
source ~/.vimrc.map

colorscheme monokai
syntax enable
set autoindent
set number
set relativenumber
set tabstop=2
set shiftwidth=2
set expandtab
set hidden
set wildmenu
set autowrite
set autoread
set mouse=a
set ignorecase
set splitbelow
set splitright
set synmaxcol=120

set backupdir=~/.vim/backup//
set directory=~/.vim/swap//
set undodir=~/.vim/undo//

runtime macros/matchit.vim

let g:airline#extensions#tabline#enabled = 1
let g:airline_powerline_fonts = 1
let g:airline_theme='powerlineish'

set laststatus=2
set colorcolumn=80

let g:angular_cli_use_dispatch = 1
let g:EasyMotion_smartcase = 1

" Neocomplete settings
let g:acp_enableAtStartup = 0
let g:neocomplete#enable_at_startup = 1
let g:neocomplete#enable_smart_case = 1
let g:neocomplete#sources#syntax#min_keyword_length = 3
if !exists('g:neocomplete#keyword_patterns')
  let g:neocomplete#keyword_patterns = {}
endif
let g:neocomplete#keyword_patterns['default'] = '\h\w*'
if !exists('g:neocomplete#force_omni_input_patterns')
  let g:neocomplete#force_omni_input_patterns = {}
endif

let g:ale_sign_column_always = 1
let g:ale_sign_error = '>>'
let g:ale_sign_warning = '--'

" Activate angular-cli.vim if @angular is present in the node_modules folder.
autocmd VimEnter * if globpath('.,..','node_modules/@angular') != '' | call angular_cli#init() | endif

set backspace=2
set backspace=indent,eol,start
