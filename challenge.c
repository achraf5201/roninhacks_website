#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

void win() {
    char flag[128];
    FILE *f = fopen("flag.txt", "r");
    if (f == NULL) {
        printf("flag.txt not found!\n");
        exit(1);
    }
    fgets(flag, sizeof(flag), f);
    printf("Congrats! Here is your flag:\n%s\n", flag);
    fclose(f);
}

void vulnerable() {
    char buffer[64];
    printf("Enter your name: ");
    read(0, buffer, 256);  // intentionally reads more than buffer can hold -> overflow
    printf("Hello, %s!\n", buffer);
}

int main() {
    setvbuf(stdout, NULL, _IONBF, 0);
    printf("=== Easy Pwn Challenge ===\n");
    vulnerable();
    printf("Goodbye!\n");
    return 0;
}