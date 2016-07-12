set nocompatible 
filetype off   
colorscheme torte 

source ~/.vimrc.bepo
source ~/.vimrc.plugin
source ~/.vimrc.map

set autoindent
set number
set relativenumber
set tabstop=2
set shiftwidth=2
set expandtab

set mouse=a

set ttymouse=xterm2

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
let g:syntastic_typescript_checkers = ['tslint']

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

set autowrite

autocmd BufNewFile,BufRead,BufFilePost *.hamljs set filetype=haml

runtime macros/matchit.vim

set ignorecase

set splitbelow
set splitright
