set nocompatible 
filetype off   

" Vim bépo mapping file.
source ~/.vimrc.bepo

" Vim plugins file.
source ~/.vimrc.plugin

" Vim custom key mapping file.
source ~/.vimrc.map

" color theme
colorscheme torte 

set autoindent
set nu
set rnu
set tabstop=2
set shiftwidth=2
set expandtab

augroup configgroup
	autocmd!
	autocmd VimEnter * highlight clear SignColumn
	autocmd BufWritePre *.php,*.py,*.js,*.txt,*.hs,*.java,*.md
				\:call <SID>StripTrailingWhitespaces()
	autocmd FileType ruby setlocal tabstop=2
	autocmd FileType ruby setlocal shiftwidth=2
	autocmd FileType ruby setlocal softtabstop=2
	autocmd FileType ruby setlocal commentstring=#\ %s
	autocmd FileType eruby setlocal tabstop=2
	autocmd FileType eruby setlocal shiftwidth=2
	autocmd FileType eruby setlocal softtabstop=2
	autocmd BufEnter *.zsh-theme setlocal filetype=zsh
	autocmd BufEnter *.scss setlocal tabstop=2
	autocmd BufEnter *.scss setlocal shiftwidth=2
	autocmd BufEnter *.scss setlocal softtabstop=2
	autocmd BufEnter *.sh setlocal tabstop=2
	autocmd BufEnter *.sh setlocal shiftwidth=2
	autocmd BufEnter *.sh setlocal softtabstop=2
augroup END

" Enable mouse use in all modes
set mouse=a

" Set this to the name of your terminal that supports mouse codes.
" Must be one of: xterm, xterm2, netterm, dec, jsbterm, pterm
set ttymouse=xterm2

if &term =~ '256color'
  " disable Background Color Erase (BCE) so that color schemes
  " render properly when inside 256-color tmux and GNU screen.
  " see also http://snk.tuxfamily.org/log/vim-256color-bce.html
  set t_ut=
endif

