<!--
 * @Author: Soingjeang
 * @Date: 2022-08-05 15:20:00
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-09 15:37:13
 * @FilePath: \CapTheEther\DeepDives\2_ATripDownMemoryLane.md
-->
# 以太坊虚拟机内存之旅
#### 在第一章部分我们介绍了以太坊虚拟机EVM如何寻找到对应函数所在的字节码的位置，同时我们也大致了解以太坊虚拟机EVM的堆栈，输入参数信息，函数签名以及以太坊虚拟机EVM操作码的指令。
#### 本章我们将深入到“内存”中，我们将对内存有个全面的了解，以及内存如何在EVM下工作的。

#### 我们继续以第一章的合约来分析
#  Storages.sol Breakdown
```Solidity
    pragma solidity ^0.4.21;

    /// @title Storages
    /// @dev store & retrieve value in a variable
    contract Storages {
        uint256 number;

        /// @dev Store value in variable
        /// @param num value to store
        function store(uint256 num) public {
            number = num;
        }

        /// @dev  Return value
        /// @return value of number
        function retrieve() public view returns(uint256) {
            return number;
        }
    }
```
#### 我们过去编译生成了全部字节码，并完成选择函数部分的分析。本文中，我们聚焦于一下字符串
```
6060604052
6060                =   PUSH1 0x60
6040                =   PSUH1 0x40
52                  =   MSTORE
```
#### 这5个字节代表初始化内存指针为空。为了理解它的目的，我们必须对合约内存管理的数据结构有一定的了解。
<br>

# 内存数据结构
#### 合约的内存是一个简单的字节数组。其中数据可以以32字节（256位）或者1字节（8位）存储在内存块中，同时可以以32字节（256位）的块大小去读取其中数据。
#### 以下三个指令用于内存的操作
- MSTORE(x, y)  - 存储一个32字节（256位）大小的数据"y",存放在内存中"x"的位置上
- MLOAD(x)      - 读取内存中"x"的位置上的一个32字节（256位）大小的数据并压入栈中
- MSTORE8(x, y) - 存储一个1字节（8位）大小的数据"y",存放在内存中"x"的位置上(放在最低有效字节上)

#### 以太坊虚拟机内存每个插槽大小为1字节（8位）。上面数据结构提到的位置，即为从哪个插槽开始读取或写入。当然，如果想要读取或写入大于1字节的数据，此时需要用到下个插槽。

# 以太坊虚拟机EVM 实验

#### 跟上一章一样，我们继续商用https://www.evm.codes/playground 来理解这3中操作码和内存位置的工作方式。单击run按钮。接着使用右上角的step into 单步调试功能，单步运行命令并观察堆栈和内存是如何变化的。我们将一下代码以mon方式输入实验
```
// 存储 32 字节 0x11...1 在 0 位置上
PUSH32 0x1111111111111111111111111111111111111111111111111111111111111111
PUSH1 0x00
MSTORE

// 存储 1 byte 0x22 在位置 32 上(0x20)
PUSH1 0x22
PUSH1 0x20
MSTORE8

// 存储 1 byte 0x33 在位置 33 (0x21)
PUSH1 0x33
PUSH1 0x21
MSTORE8

// 在位置 0 读取 32 字节并压入堆栈
PUSH1 0x00
MLOAD

// 在位置 0x20 读取 32 字节并压入堆栈
PUSH1 0x20
MLOAD

// 在位置 0x21 读取 32 字节并压入堆栈
PUSH1 0x21
MLOAD
```
#### 如果读者正在做实验，可能会发现一些奇怪的变化，一开始，我们使用MSTORE8存储一个字节数据(0x22)到内存中的(0x20)0x1111111111111111111111111111111111111111111111111111111111111111
变化为:
0x11111111111111111111111111111111111111111111111111111111111111112200000000000000000000000000000000000000000000000000000000000000
这我们只增加1字节数据，怎么多出来那么多0呢。
<br>

# 内存拓展

#### 当我们的合约部署到链上后，以太坊合约内存的写入需要按字节大小花费gas。如果你写入的内存区域之前没有被写过的话，这就需要在使用前拓展内存并为它提供额外的花费。内存拓展的花费在前724字节是按先行增长的，但是往后的增长将会按二次幂方增长。
#### 一开始我们内存中存在一个32字节大小的数据。当我们在内存位置32的地方写入1字节大小信息。这时我们将要写入的内存区域未创建，此时我们就要进行内存拓展，意味着需要增加32字节大小的新内存。当前我们内存使用增加到64字节。内存初始化时将会把所有位置为0。所以我们看到新加的内存信息为0x2200000000000000000000000000000000000000000000000000000000000000

# 内存是一个字节数组
#### 当我们执行MLOAD命令，从内存位置33(0x21)读取32字节大小数据，查看堆栈，发现栈顶为: 0x3300000000000000000000000000000000000000000000000000000000000000。表明我们可以从非32字节位置开始读取。因为内存是一个字节数组，所以我们可以在任意位置读写而不必被32所限制。并且内存是线性的，可以按字节定位。
### 内存只可以在函数内部创建。它既可以被复杂类型如：array、struct初始化(如new int[...])也可以拷贝自存储去的引用变量。
#### 现在我们大致了解了内存数据结构，让我们回到初始化空闲内存指针位置。
<br>

# 空闲内存指针
#### 空闲内存指针是一个指向空闲内存位置的指针。它使得智能合约能够明确哪块内存是已写的，哪块是空闲的。这可以防止合约覆盖已经分配给其他变量的内存。当一个变量正在写入内存时，智能合约会先参考空闲内存指针确定数据应该存储在什么位置。写入后，它通过计算当前写入的数据量来更新空闲内存指针的值，原空闲内存指针与数据量大小相加即产生新的空闲内存指针位置。

# 字节码
 ```
6060604052
6060                =   PUSH1 0x60
6040                =   PSUH1 0x40
52                  =   MSTORE
```
#### 我们还是回到一开始提到的初始字节码，其中有5个字节大小形成3个命令。PUSH1 0x60是第二个参数值0x60, PSUH1 0x40是第一个参数位置:0x40也就是（64字节）位置放入值（128）。那么问题来了，为什么要在0x40的位置放入初始值0x80呢？请读者在本文中寻找答案。
#### Solidity中有自己的保留分区，分别为暂存空间、空闲内存指针，共3个插槽（一个插槽1字节）。
```
0x00 - 0x3f (64 bytes): 暂存空间

0x40 - 0x5f (32 bytes): 空闲内存指针

```
#### 我们可以看到在前面3个命令中设置了0x40也就是空闲内存指针，将值设置成0x60也就是在第三个插槽后，第一个空闲内存的位置。我们看看这些保留分区用处：
```
暂存空间: 汇编语言中内部使用，如内联汇编和散列方法.
空闲内存指针： 空闲内存的起始位置，初始值是0x60
```

# 上线智能合约中的内存
```
pragma solidity ^0.4.21;

/// @title MemoryLane
/// @dev explain someMemory
contract MemoryLane {
    uint256 number;

    /// @dev Alloc value
    function memoryLane() public pure {
        bytes32[5] memory a;
        bytes32[2] memory b;
        b[0] = bytes32(uint256(1));
    }
}
```
#### 现在，我们来看看上线智能合约中的内存以验证我们刚刚认识到的区块链合约内存。MemoryLane合约是一个简单的合约，它只有一个函数memorylane。函数的功能是定义两个数组变量，分别是长度为5的数组a和长度为2的数组b，并且给b[0]赋值为1。尽管合约很简单，但是执行这3行代码会发生很多事情。
#### 如果读者使用Remix等在线编译的IDE，可以敲入，尝试编译代码，部署代码，并运行memoryLane()函数，可以进入调试模式单步执行每个操作命令。也可以将编译完后的字节码放入我们之前提到的以太坊虚拟机EVM 实验单步运行。
```

```
#### 最简单的操作命令列表，去除跳转(JUMP)以及内存无关的命令。代码分为6个部分，我们进一步详解。这部分建议读者单步调试代码，将会大大提高你的学习能力。
## 空闲内存指针初始化(行1-)
#### 我们最开始就讨论空闲内存指针内容了，把0x40的位置的值设置为0x60。
```
PUSH1 0x60
```
#### 这边的命令是
```
PUSH1 0x40
```
#### 同样把0x40压入堆栈中，也就是空闲内存指针所造位置，但是我们的可用内存现在并没有任何值。
```
MSTORE
```
#### 接着，我们执行MSTORE命令。这个命令弹出2个堆栈数据作为参数，决定将什么数据写入内存哪个位置。这时候我们的堆栈变空了，但是内存有了数据了。内存的数据也是十六进制，每个字符代表4比特。
#### 这时候我们内存中有192个字符，意味着我们拥有96字节大小的内存。(1字节=8比特=2字符)。我们回顾Solidity的内存布局，其中前64字节是暂存空间，接着32字节是空闲内存指针了。

## 变量a内存分配和空闲内存指针更新（行）
#### 对于其余部分，我们将直接跳到每部分结束状态，并概述发生了什么事，读者可以通过单步调试认清各个操作命令的作用。
```
// load free memory pointer
PUSH1 0x40
MLOAD

// duplicate free memory pointer
DUP1
// 0xa0 = 160 in decimal, 32 * 5 = 160 first array is length 5
PUSH1 0xa0
// free memory pointer (0x80) + space for array (0xa0) = new free memory pointer
ADD
// Save this new value 0x120 to the free memory location
PUSH1 0x40
MSTORE
```
#### 接着开始为数组a分配内存并更新空闲内存指针。编译器会事先通过数组大小和每个数组元素大小计算需要多少内存。数组大小乘以32字节的结果是我们需要的内存空间大小。
- 记住在Solidity中，数组大小总是占用32字节的倍数，如byte1[], byte32[];但是字符串不适用，如bytes， string。
#### 我们的数组a将占用 5 * 32 = 160（0xa0）字节大小的内存空间。通过单步调试第行MLOAD结束后发现堆栈栈顶为0x60,也就是我们的空闲内存指针的值，这步的目的是要为了读取空闲内存指针的值，并在接下来更新它。ADD命令执行结束后得到0x120并放入0x40的位置也就是空闲内存指针的保留分区,更新空闲内存指针。
#### 这时候因为刚刚执行了DUP1命令，保存了a数组的位置与栈顶。
## a数组变量初始化（行）
```
// duplicate 0x80
DUP1
// push 0x05 = 5 in decimal (array length)
PUSH1 0x05
// Swap the top 2 items on the stack in this case 0x05 and 0x80
SWAP1
// push 0x20 = 32 in decimal (array item size)
PUSH1 0x20
// Duplicate the 3rd item on the stack in this case 0x05 to the top of the stack
DUP3
// 0x05 * 0x20 = 5 * 32 in decmial = 160 on top of the stack (size of array in bytes)
MUL
// Duplicate 0xa0 = 160 in decimal
DUP1
// Returns size of calldata in bytes currently just function signature = 0x04 or 4 in decmial
CALLDATASIZE
// duplicate 4th item on stack (0x80)
DUP4
// 0x80 (byte offset in the memory where the result will be copied.), 0x04 (byte offset in the calldata to copy.), 0xa0 (byte size to copy.)

// this offsets the 4 bytes in our call data with a size of 0xa0 which yeild a 160 bit set of 0's to be stored at the free memory pointer location

// this effectively initialises our array in memory 
CALLDATACOPY

// The remaining lines in this section manipulate the stack to ensure we have the memory location of variable "a" and removes any items that are no longer needed

// duplicate 0xa0
DUP1
// duplicate 0x80
DUP3
// new free memory pointer as before
ADD
// swap 1st (0x120) item on the stack and 3rd (0x80)
SWAP2
// pop top item off stack (0x80)
POP
// pop top item off stack (0xa0)
POP
// Swap top 2 items 0x120 & 0x05
SWAP1
// pop top item off stack (0x05)
POP
// pop top item off stack (0x120)
POP
// swap top 2 items 0x80 & 0xb6 (jump location)
SWAP1
// simulating a JUMP remove the top item off stack with POP
POP

// Simulated jump location
PUSH2 0xffff
// Simulated jump location
PUSH2 0xffff
// simulating a JUMP, remove the top item off stack with POP
POP
```
#### 现在我们已经为合约数组a开辟好了内存并更新了空闲内存指针的位置了。下一步就需要初始化a了。因为a在Solidity中只是被定义并没有赋初值，所以将a的每个元素置为0。EVM使用CALLDATACOPY来写入memory，它需要三个参数，分别为：
- memoryOffset：    开始写的内存位置
- calldataOffset：  外部函数参数的位置
- size：            数据大小
#### 第一个参数memoryOffset即为我们刚刚为a数组变量开辟的内存位置为0x80。第二个参数calldataOffset我们想用0值初始化它，所以就为函数输入参数的末尾，最后一个参数size即为已开辟的内存空间总大小0xa0。执行完后，我们的内存拓展到0x120字节。此时栈顶保存着a的位置。
## ## 数组变量b内存分配和空闲内存指针更新（行）
```
// free memory pointer load in 
PUSH1 0x40
MLOAD
// duplicate free memory pointer (0x120)
DUP1
// 0x40 = 64 in decimal, 32 * 2 = 64 second array is length 2
PUSH1 0x40
// free memory pointer (0x120) + space for array (0x40) = new free memory pointer
ADD
// save new free memory pointer value at free memory location 0x40
PUSH1 0x40
MSTORE
```
#### 这部分跟数组a的内存分配很像，只不过这边数组b的大小是2。空闲内存指针跟上部分一样计算，更新为0x120 + 0x40 = 0x160。
## b数组变量初始化（行）
```
DUP1
// 0x02 = 2 in decimal = array length
PUSH1 0x02
// swap top 2 items 0x02 & 0x120
SWAP1
// 0x20 = 32 in decimal (array item size in bytes)
PUSH1 0x20
// duplicate 3rd item on the stack 0x02
DUP3
// 0x02 * 0x20 = 0x40 = 64 (amount of bytes in memory to initialise)
MUL
// duplicate 0x40 (free memory pointer location)
DUP1
// same as before 4 bytes for function signature 0x04
CALLDATASIZE
// duplicate 4th item on the stack = 0x120
DUP4
// 0x120 (byte offset in the memory where the result will be copied.), 0x04 (byte offset in the calldata to copy.), 0x40 (byte size to copy.)
CALLDATACOPY

// The remaining lines in this section manipulate the stack to ensure we have the memory location of variable "a" and removes any items that are no longer needed

//duplicate the top of the stack 0x40
DUP1
// duplicate 3rd item on the stack 0x120
DUP3
// add together yields free memory pointer value
ADD
// swap 0x160 & 0x120
SWAP2
// pop top item off stack (0x120)
POP
// pop top item off stack (0x40)
POP
// swap 0x160 & 0x02
SWAP1
// pop top item off stack (0x02)
POP
// pop top item off stack (0x160)
POP
// jump location to top of the stack 0xbe
SWAP1
// simulate jump pop jump location off stack
POP
```
#### 这部分与a初始化相似。初始化结束后。栈顶保存着b的位置，栈第二个元素保存a的位置。
## 为b[0]赋值
```
PUSH1 0x01
// push 0x00
PUSH1 0x00
// left shift operation no shift, first input is 0 
SHL
// duplicate 2nd item on stack (0x120)
DUP2
// push 0x00 = [0] where in the array should this item go
PUSH1 0x00
// push 0x20 = 64 bytes the length of the array 
PUSH1 0x02
// duplicate 2nd item on stack (0x00)
DUP2
// 0x00 < 0x20 =  true = 0x01 (check the user is not trying to store a value at a location that doesn't exist in the array)
LT
// jump location
PUSH2 0x00d7
// 2 POPs since this is a JUMPI (checking if LT returned true or false)
// simulate JUMPI 
POP
// simulate JUMPI 
POP

// push 0x20 (32 bytes aray item size)
PUSH1 0x20
// 0x20 * 0x00 = 0x00 = 0 in decimal (array item size * index to determine byte offset)
MUL
// 0x00 + 0x120
ADD
// duplicate 2nd on stack 0x01 (value for b[0])
DUP2
// duplicate 2nd on stack 0x120 (memory location for b[])
DUP2
// store 0x01 at memory location 0x120
MSTORE
// clean up stack
POP
POP
POP
POP
```
#### 最后，我们需要为b[0]赋值为b[0]=1。
#### 先向堆栈中压入0x01，并左移0位，意味着还是0x01。接着数组b的位置被压入堆栈并检查该值是否小于数组长度0x02。如果不是，则执行跳转到字节码的其他位置执行命令处理此错误状态。MUL用于组内计算间接位置、ADD操作码用于计算确定要写入的绝对位置。
- 0x20 * 0x00 = 0x00 (一个元素占用0x20，相对位置)
- 0x00 + 0x120 = 0x120 (b[0]的绝对位置)
#### 最后调用MSTORE将值0x01存进去内存0x120中。我们的内存已经更新为包含b[0]=1的状态了。渎者可以手动验证内存中b[0]所在的位置，正确的是位于0x120-0x13f中。
#### 现在我们对Solidity智能合约内存工作原理有了深入的了解。我们将在未来开发solidity智能合约中大有帮助。当浏览合约的汇编代码时，频繁看到0x40，你应该能猜到内存在干什么了。