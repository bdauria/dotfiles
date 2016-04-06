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

" Enable mouse use in all modes
set mouse=a

" Set this to the name of your terminal that supports mouse codes.
set ttymouse=xterm2

if &term =~ '256color'
  " disable Background Color Erase (BCE) so that color schemes
  " render properly when inside 256-color tmux and GNU screen.
  " see also http://snk.tuxfamily.org/log/vim-256color-bce.html
  set t_ut=
endif

" Syntastic settings
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
let g:syntastic_ruby_checkers = ['rubocop']
let g:syntastic_haml_checkers = ['haml_lint']

" Put swap files away
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

" Automatically save changes before switching buffer with some
" commands, like :cnfile.
set autowrite
