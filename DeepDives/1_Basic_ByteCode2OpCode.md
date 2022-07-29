<!--
 * @Author: Soingjeang
 * @Date: 2022-07-27 12:01:32
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-29 16:13:41
 * @FilePath: \CapTheEther\DeepDives\1_Basic_ByteCode2OpCode.md
-->
#  前言
#### &emsp;第一原则，要聚集思维思考基础概念。这样n我们能更好的理解顶层设计。   

#### &emsp;在只能合约的世界中。围绕“以太坊虚拟机EVM”算法和数据结构是主要的基础概念。然后才是Solidity语言和智能合约这样的顶层设计。为了成了solidity开发工程师必须深入理解以太坊虚拟机EVM。  
#### &emsp;这是本书“深入挖掘EVM”的第一章，深入以太坊是理解基础知识必备的素质。
&nbsp;

#  基础：Solidity->ByteCode(字节码)->OpCode（操作码）
#### &emsp;在本文开始时，读者必须已经掌握基础的Solidity基础知识和如何部署到以太坊链的方法。同时我也会简要概过这部分主题，如果想摄入挖掘，请学习相关内容。
#### &emsp;Solidity需要先编译为字节码才能部署进入以太坊中。这些字节码有对应于一些可以被以太坊虚拟机EVM执行的操作码指令。
#### &emsp;本此列文章聚焦于部分特别字节码，阐明它们的工作方法。你需要在每个章节结束前回调提出的问题。按此方式，你将会掌握大部分以太坊虚拟机EVM的基础知识。
#### 现在我们开始一个基础的solidity合约和它编译后的字节码ByteCode/操作码OpCode。我们来演示EVM如何选择函数。
#### 运行时的字节码是整个Solidity合约编译后的信息，代表整个合约。一旦合约部署完成。你可以运行call合约内部的一个函数或者多个函数。
#### 问题来了：我们执行哪个函数时以太坊虚拟机EVM如何知道所对应的字节码呢？这是我们理解以太坊虚拟接工作的第一个问题。以太坊虚拟机是如何去处理这种情况呢，请看此例子
<br>
## Storages.sol Breakdown

<table>
<tr>
<th>

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
</th>
</table>

#### 在此例子中，我们使用 Storages.sol 合约。这个合约拥有2个函数：store() 和 retrieve()。因此以太坊虚拟机需要分清需要执行哪个函数。下面是此合约的字节码。
<table>
<tr>
<th>
0x6060604052341561000f57600080fd5b60d38061001d6000396000f3006060604052600436106
049576000357c0100000000000000000000000000000000000000000000000000000000900463ff
ffffff1680632e64cec114604e5780636057361d146074575b600080fd5b3415605857600080fd5
b605e6094565b6040518082815260200191505060405180910390f35b3415607e57600080fd5b60
926004808035906020019091905050609d565b005b60008054905090565b8060008190555050560
0a165627a7a72305820e617e7f4250b8b23fd5444b810722168c25afffc26da3945d09cb23eafa8
a04e0029
</th>
</table>