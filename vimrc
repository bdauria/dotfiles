set nocompatible 

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
set autowrite
set mouse=a
set ignorecase
set splitbelow
set splitright

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

" Set up vertical vs block cursor for insert/normal mode
if &term =~ "screen."
  let &t_ti.="\eP\e[1 q\e\\"
  let &t_SI.="\eP\e[5 q\e\\"
  let &t_EI.="\eP\e[1 q\e\\"
  let &t_te.="\eP\e[0 q\e\\"
else
  let &t_ti.="\<Esc>[1 q"
  let &t_SI.="\<Esc>[5 q"
  let &t_EI.="\<Esc>[1 q"
  let &t_te.="\<Esc>[0 q"
endif

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

let g:ale_sign_error = '>>'
let g:ale_sign_warning = '--'

" Activate angular-cli.vim if @angular is present in the node_modules folder.
autocmd VimEnter * if globpath('.,..','node_modules/@angular') != '' | call angular_cli#init() | endif
